'use strict'
const { CourseModel } = require('../models/courseModel')

const co = require('co')
const log = require('kth-node-log')

module.exports = {
  getImageInfo: co.wrap(getImageInfo),
  postImageInfo: co.wrap(postImageInfo)
}

async function getImageInfo (req, res) {
  try {
    log.debug('==Course Code=', req.params.courseCode)
    let doc = {}
    if (process.env.NODE_MOCK) {
      doc = await { courseCode: 0, sellingText: 'mockSellingText' }
    } else {
      doc = await CourseModel.findOne({ 'courseCode': req.params.courseCode.toUpperCase() })
    }

    if (!doc) {
      return
    }

    res.json({ courseCode: doc.courseCode, ImageInfo: doc.ImageInfo })
  } catch (err) {
    log.error('Failed to get a sellingText, error:', err)
    return err
  }
}

async function postImageInfo (req, res) {
  try {
    let doc = await CourseModel.findOne({ 'courseCode': req.params.courseCode.toUpperCase() })

    if (!doc) {
      log.info('Course information is not found for a course: ', req.params.courseCode, 'and will try create a new')
      doc = new CourseModel({
        courseCode: req.params.courseCode.toUpperCase(),
        imageInfo: req.body.imageInfo
      })
    } else {
      doc.imageInfo = req.body.imageInfo
    }

    await doc.save()
    res.json({ courseCode: doc.courseCode.toUpperCase(), imageInfo: req.body.imageInfo })
  } catch (err) {
    log.error('Failed posting a ImageInfo, error:', err)
    return err
  }
}
