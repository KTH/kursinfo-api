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
    console.log('==Course Code=', req.params.courseCode)
    let doc = {}
    if (process.env.NODE_MOCK) {
      doc = yield { courseCode: 0, sellingText: 'mockSellingText' }
    } else {
      doc = yield CourseModel.findOne({ 'courseCode': req.params.courseCode.toUpperCase() })
    }

    if (!doc) {
      return next()
    }

    res.json({ courseCode: doc.courseCode,
      sellingText: {
        en: doc.sellingText_en,
        sv: doc.sellingText_sv
      },
      imageInfo: doc.imageInfo,
      isCourseWebLink: doc.isCourseWebLink })
    // res.json(doc)
  } catch (err) {
    log.error('Failed to get a sellingText, error:', err)
    next(err)
  }
}

function * postData (req, res, next) {
  try {
    console.log('==Update selling text for course', req.params.courseCode)
    let doc = yield CourseModel.findOne({ 'courseCode': req.params.courseCode.toUpperCase() })

    const sellingTexts = req.body.sellingText

    if (!doc) {
      log.info('Selling info not found for a course: ', req.params.courseCode, 'and will try create a new')
      doc = new CourseModel({
        courseCode: req.params.courseCode.toUpperCase(),
        sellingText_sv: sellingTexts.sv,
        sellingText_en: sellingTexts.en
      })
    } else {
      doc.sellingText_sv = sellingTexts.sv
      doc.sellingText_en = sellingTexts.en
    }

    yield doc.save()
    res.json({ courseCode: doc.courseCode.toUpperCase(), sellingTexts_en: sellingTexts.en, sellingText_sv: sellingTexts.sv })
  } catch (err) {
    log.error('Failed posting a sellingText, error:', err)
    next(err) // throw err
  }
}
