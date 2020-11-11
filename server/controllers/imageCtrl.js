'use strict'

const { CourseModel } = require('../models/courseModel')

const log = require('kth-node-log')

async function getImageInfo(req, res) {
  try {
    log.debug('==Course Code=', req.params.courseCode)
    let doc = {}
    if (process.env.NODE_MOCK) {
      doc = await { courseCode: 0, sellingText: 'mockSellingText' }
    } else {
      doc = CourseModel.findOne({ courseCode: req.params.courseCode.toUpperCase() })
    }

    if (!doc) {
      log.debug('Course is not yet in db so get empty data from kursinfo-api for course', req.params.courseCode)
      return res.json()
    }

    res.json({ courseCode: doc.courseCode, ImageInfo: doc.ImageInfo })
  } catch (err) {
    log.error('Failed to get a ImageInfo, error:', err)
    return err
  }
}

async function postImageInfo(req, res) {
  try {
    const courseCode = req.params.courseCode.toUpperCase()
    const { imageInfo } = req.body
    let doc = await CourseModel.findOne({ courseCode })

    if (!doc) {
      log.info('Course information is not found for a course: ', courseCode, 'and will try create a new')
      doc = new CourseModel({
        courseCode,
        imageInfo,
      })
    } else {
      doc.imageInfo = imageInfo
    }

    await doc.save()
    res.json({ courseCode, imageInfo })
  } catch (err) {
    log.error('Failed posting a ImageInfo, error:', err)
    return err
  }
}

module.exports = {
  getImageInfo,
  postImageInfo,
}
