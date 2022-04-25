/* eslint-disable consistent-return */

'use strict'

const { CourseModel } = require('../models/courseModel')

const log = require('@kth/log')

async function postCourseWebLink(req, res) {
  const { courseCode } = req.params
  const { isCourseWebLink } = req.body
  try {
    let doc = await CourseModel.aggregate([{ $match: { courseCode: courseCode.toUpperCase() } }])

    if (!doc) {
      log.info('Course information is not found for a course: ', courseCode, 'and will try create a new')
      doc = new CourseModel({
        courseCode: courseCode.toUpperCase(),
        isCourseWebLink,
      })
    } else {
      doc.isCourseWebLink = isCourseWebLink
    }

    await doc.save()
    res.json({ courseCode: doc.courseCode.toUpperCase(), isCourseWebLink })
  } catch (err) {
    log.error('Failed posting a isCourseWebLink, error:', err)
    return err // throw err
  }
}

module.exports = {
  postCourseWebLink,
}
