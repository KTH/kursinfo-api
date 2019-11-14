'use strict'
const { CourseModel } = require('../models/courseModel')

const co = require('co')
const log = require('kth-node-log')

module.exports = {
  getData: co.wrap(getData),
  postData: co.wrap(postData)
}

async function getData (req, res) {
  try {
    const courseCode = req.params.courseCode.toUpperCase()
    let doc = {}
    if (process.env.NODE_MOCK) {
      doc = await { courseCode: 0, sellingText: 'mockSellingText' }
    } else {
      doc = await CourseModel.findOne({ 'courseCode': courseCode })
    }

    if (!doc) {
      return
    }
    log.info('Get data from kursinfo-api for course', courseCode)
    res.json({ courseCode: doc.courseCode,
      sellingText: {
        en: doc.sellingText_en,
        sv: doc.sellingText_sv
      },
      imageInfo: doc.imageInfo,
      isCourseWebLink: doc.isCourseWebLink,
      sellingTextAuthor: doc.sellingTextAuthor })
    // res.json(doc)
  } catch (err) {
    log.error('Failed to get a sellingText, error:', { err })
    return err
  }
}

async function postData (req, res) {
  try {
    const courseCode = req.params.courseCode.toUpperCase()
    let doc = await CourseModel.findOne({ 'courseCode': courseCode })
    const sellingTexts = req.body.sellingText
    log.info('Saving for a course: ', courseCode, 'Data: ', req.body)
    if (!doc) {
      log.info('Selling info was not found for the course: ', courseCode, 'therefore will try create a new')
      doc = new CourseModel({
        courseCode: courseCode,
        imageInfo: req.body.imageInfo,
        sellingText_sv: sellingTexts.sv,
        sellingText_en: sellingTexts.en,
        sellingTextAuthor: req.body.sellingTextAuthor
      })
    } else {
      doc.imageInfo = req.body.imageInfo
      doc.sellingText_sv = sellingTexts.sv
      doc.sellingText_en = sellingTexts.en
      doc.sellingTextAuthor = req.body.sellingTextAuthor
    }

    await doc.save()
    log.info('==Updated selling text for course', courseCode)
    log.info('==Updated picture for course', courseCode, ' imageInfo ->', req.body.imageInfo)
    res.json({
      courseCode: doc.courseCode.toUpperCase(),
      imageInfo: doc.imageInfo,
      sellingTexts_en: sellingTexts.en,
      sellingText_sv: sellingTexts.sv,
      sellingTextAuthor: doc.sellingTextAuthor
    })
  } catch (err) {
    log.error('Failed posting a sellingText, error:', { err })
    return err // throw err
  }
}
