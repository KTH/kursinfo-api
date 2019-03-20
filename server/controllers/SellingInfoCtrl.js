'use strict'
const { CourseModel } = require('../models/courseModel')

const co = require('co')
const log = require('kth-node-log')

// const { safeGet } = require('safe-utils')
// const config = require('../configuration').server
// const { BasicAPI } = require('kth-node-api-call')

module.exports = {
  getData: co.wrap(getData),
  postData: co.wrap(postData)
}

function * getData (req, res, next) {
  try {
    const courseCode = req.params.courseCode.toUpperCase()
    let doc = {}
    if (process.env.NODE_MOCK) {
      doc = yield { courseCode: 0, sellingText: 'mockSellingText' }
    } else {
      doc = yield CourseModel.findOne({ 'courseCode': courseCode })
    }

    if (!doc) {
      return next()
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
    next(err)
  }
}

function * postData (req, res, next) {
  try {
    const courseCode = req.params.courseCode.toUpperCase()
    let doc = yield CourseModel.findOne({ 'courseCode': courseCode })
    const sellingTexts = req.body.sellingText

    if (!doc) {
      log.info('Selling info not found for a course: ', courseCode, 'and will try create a new')
      doc = new CourseModel({
        courseCode: courseCode,
        sellingText_sv: sellingTexts.sv,
        sellingText_en: sellingTexts.en,
        sellingTextAuthor: req.body.sellingTextAuthor
      })
    } else {
      doc.sellingText_sv = sellingTexts.sv
      doc.sellingText_en = sellingTexts.en
      doc.sellingTextAuthor = req.body.sellingTextAuthor
    }

    yield doc.save()
    log.info('==Updated selling text for course', courseCode)
    res.json({ courseCode: doc.courseCode.toUpperCase(),
      sellingTexts_en: sellingTexts.en,
      sellingText_sv: sellingTexts.sv,
      sellingTextAuthor: doc.sellingTextAuthor })
  } catch (err) {
    log.error('Failed posting a sellingText, error:', { err })
    next(err) // throw err
  }
}
