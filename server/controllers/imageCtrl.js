'use strict'
const { CourseModel } = require('../models/courseModel')

const co = require('co')
const log = require('kth-node-log')

// const { safeGet } = require('safe-utils')
// const config = require('../configuration').server
// const { BasicAPI } = require('kth-node-api-call')

module.exports = {
  getImageInfo: co.wrap(getImageInfo),
  postImageInfo: co.wrap(postImageInfo)
}

function * getImageInfo (req, res, next) {
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

    res.json({ courseCode: doc.courseCode, ImageInfo: doc.ImageInfo })
  } catch (err) {
    log.error('Failed to get a sellingText, error:', err)
    next(err)
  }
}

function * postImageInfo (req, res, next) {
  try {
    let doc = yield CourseModel.findOne({ 'courseCode': req.params.courseCode.toUpperCase() })

    if (!doc) {
      log.info('Course information is not found for a course: ', req.params.courseCode, 'and will try create a new')
      doc = new CourseModel({
        courseCode: req.params.courseCode.toUpperCase(),
        imageInfo: req.body.imageInfo
      })
    } else {
      doc.imageInfo = req.body.imageInfo
    }

    yield doc.save()
    res.json({ courseCode: doc.courseCode.toUpperCase(), imageInfo: req.body.imageInfo })
  } catch (err) {
    log.error('Failed posting a ImageInfo, error:', err)
    next(err) // throw err
  }
}
