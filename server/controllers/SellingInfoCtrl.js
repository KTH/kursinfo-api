/* eslint-disable consistent-return */

'use strict'

const { CourseModel } = require('../models/courseModel')

const log = require('@kth/log')

async function getData(req, res) {
  try {
    const courseCode = req.params.courseCode.toUpperCase()
    let doc = {}
    if (process.env.NODE_ENV === 'test') {
      doc = { courseCode, sellingText_sv: 'mockSellingText', sellingText_en: 'caffe moca' }
    } else {
      doc = await CourseModel.findOne({ courseCode })
      console.log(doc)
    }

    if (!doc) {
      log.info('Course is not yet in db so get empty data from kursinfo-api for course', courseCode)
      return res.json()
    }
    log.info('Get data from kursinfo-api for course', courseCode)
    res.json({
      courseCode: doc.courseCode,
      sellingText: {
        en: doc.sellingText_en,
        sv: doc.sellingText_sv,
      },
      imageInfo: doc.imageInfo,
      sellingTextAuthor: doc.sellingTextAuthor,
    })
    // res.json(doc)
  } catch (err) {
    log.error('Failed to get a sellingText, error:', { err })
    return err
  }
}

async function postData(req, res) {
  try {
    const courseCode = req.params.courseCode.toUpperCase()
    let doc = await CourseModel.findOne({ courseCode })
    const { sellingText: sellingTexts, sellingTextAuthor, imageInfo } = req.body
    log.info('Saving for a course: ', courseCode, 'Data: ', req.body)
    if (!doc) {
      log.info('Selling info was not found for the course: ', courseCode, 'therefore will try create a new')
      doc = new CourseModel({
        courseCode,
        imageInfo,
        sellingText_sv: sellingTexts.sv,
        sellingText_en: sellingTexts.en,
        sellingTextAuthor,
      })
    } else {
      doc.imageInfo = imageInfo
      doc.sellingText_sv = sellingTexts.sv
      doc.sellingText_en = sellingTexts.en
      doc.sellingTextAuthor = sellingTextAuthor
    }

    await doc.save()
    log.info('==Updated selling text for course', courseCode)
    log.info('==Updated picture for course', courseCode, ' imageInfo ->', imageInfo)
    res.json({
      courseCode: doc.courseCode.toUpperCase(),
      imageInfo: doc.imageInfo,
      sellingTexts_en: sellingTexts.en,
      sellingText_sv: sellingTexts.sv,
      sellingTextAuthor: doc.sellingTextAuthor,
    })
  } catch (err) {
    log.error('Failed posting a sellingText, error:', { err })
    return err // throw err
  }
}

async function getUploadedImagesNames(req, res) {
  try {
    const coursesWithOwnImages = await CourseModel.find({})
    // aggregate DOESN'T FETCH ALL COURSES >> aggregate([
    //   { $match: { imageInfo: { $regex: '^Picture_by_own_choice_*' } } },
    // ])

    if (coursesWithOwnImages.length === 0) {
      log.info('There is not any course with an uploaded image')
      return res.json()
    }
    const imagesNames = coursesWithOwnImages.map(course => course.imageInfo).filter(name => !!name)

    log.info('Found uploaded images, count', imagesNames.length)
    res.json(imagesNames)
  } catch (err) {
    log.error('Failed to get images and its names, error:', { err })
    return err
  }
}

module.exports = {
  getData,
  postData,
  getUploadedImagesNames,
}
