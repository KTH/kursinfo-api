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

    // res.json({ courseCode: doc.courseCode, sellingText_sv: doc.sellingText_sv, sellingText_en: doc.sellingText_en, ImageInfo: doc.ImageInfo })
    res.json(doc)
  } catch (err) {
    log.error('Failed to get a sellingText, error:', err)
    next(err)
  }
}

function * postData (req, res, next) {
  try {
    console.log('==Update selling text for course', req.params.courseCode, ', language: ', req.body.lang)
    let doc = yield CourseModel.findOne({ 'courseCode': req.params.courseCode.toUpperCase() })

    const textLangStr = `sellingText_${req.body.lang}`

    if (!doc) {
      log.info('Selling info not found for a course: ', req.params.courseCode, 'and will try create a new')
      doc = new CourseModel({
        courseCode: req.params.courseCode.toUpperCase(),
        [textLangStr]: req.body.sellingText
      })
    } else {
      doc[textLangStr] = req.body.sellingText
    }

    yield doc.save()
    res.json({ courseCode: doc.courseCode.toUpperCase(), [textLangStr]: req.body.sellingText })
  } catch (err) {
    log.error('Failed posting a sellingText, error:', err)
    next(err) // throw err
  }
}
