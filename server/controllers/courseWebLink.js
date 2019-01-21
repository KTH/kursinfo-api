
postCourseWebLink

'use strict'
const { CourseModel } = require('../models/courseModel')

const co = require('co')
const log = require('kth-node-log')

// const { safeGet } = require('safe-utils')
// const config = require('../configuration').server
// const { BasicAPI } = require('kth-node-api-call')

module.exports = {
  postCourseWebLink: co.wrap(postCourseWebLink)
}

function * postCourseWebLink (req, res, next) {
  try {
    let doc = yield CourseModel.findOne({ 'courseCode': req.params.courseCode.toUpperCase() })

    if (!doc) {
      log.info('Course information is not found for a course: ', req.params.courseCode, 'and will try create a new')
      doc = new CourseModel({
        courseCode: req.params.courseCode.toUpperCase(),
        isCourseWebLink: req.body.isCourseWebLink
      })
    } else {
      doc.isCourseWebLink = req.body.isCourseWebLink
    }

    yield doc.save()
    res.json({ courseCode: doc.courseCode.toUpperCase(), isCourseWebLink: req.body.isCourseWebLink })
  } catch (err) {
    log.error('Failed posting a ImageInfo, error:', err)
    next(err) // throw err
  }
}
