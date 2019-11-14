'use strict'
const { CourseModel } = require('../models/courseModel')

const co = require('co')
const log = require('kth-node-log')

module.exports = {
  postCourseWebLink: co.wrap(postCourseWebLink)
}

async function postCourseWebLink (req, res) {
  try {
    let doc = await CourseModel.findOne({ 'courseCode': req.params.courseCode.toUpperCase() })

    if (!doc) {
      log.info('Course information is not found for a course: ', req.params.courseCode, 'and will try create a new')
      doc = new CourseModel({
        courseCode: req.params.courseCode.toUpperCase(),
        isCourseWebLink: req.body.isCourseWebLink
      })
    } else {
      doc.isCourseWebLink = req.body.isCourseWebLink
    }

    await doc.save()
    res.json({ courseCode: doc.courseCode.toUpperCase(), isCourseWebLink: req.body.isCourseWebLink })
  } catch (err) {
    log.error('Failed posting a ImageInfo, error:', err)
    return err // throw err
  }
}
