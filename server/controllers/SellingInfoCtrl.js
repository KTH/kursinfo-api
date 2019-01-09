'use strict'
const { SellingInfo } = require('../models/sellingInfo')
const co = require('co')
// const { safeGet } = require('safe-utils')
// const config = require('../configuration').server
// const { BasicAPI } = require('kth-node-api-call')

module.exports = {
  getData: co.wrap(getData),
  postData: co.wrap(postData)
  // getSellingText: co.wrap(getSellingText)
}

// let koppsApiInternal = new BasicAPI({
//   hostname: config.kopps.host,
//   basePath: '/api/kopps/internal/',
//   https: false, // config.kopps.https,
//   json: true,
//   // Kopps is a public API and needs no API-key
//   defaultTimeout: config.kopps.defaultTimeout
// })

function * getData (req, res, next) {
  try {
    let doc = {}
    if (process.env.NODE_MOCK) {
      doc = yield { courseCode: 0, sellingText: 'mockSellingText' }
    } else {
      doc = yield SellingInfo.findOne({ 'courseCode': req.params.courseCode })
    }

    if (!doc) {
      return next()
    }

    res.json({ courseCode: doc.courseCode, sellingText: doc.sellingText })
  } catch (err) {
    next(err)
  }
}

function * postData (req, res, next) {
  try {
    let doc = yield SellingInfo.findOne({ 'courseCode': req.params.courseCode })
    console.log('=====================cD=========================', req.params.courseCode)

    if (!doc) {
      console.log('=====================SELLING INFO NOT FOUND=========================', req.params.courseCode)
      doc = new SellingInfo({
        courseCode: req.params.courseCode,
        sellingText: req.body.sellingText
      })
    } else {
      doc.sellingText = req.body.sellingText
    }

    yield doc.save()
    res.json({ courseCode: doc.courseCode, sellingText: doc.sellingText })
  } catch (err) {
    next(err)
  }
}
