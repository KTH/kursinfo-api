'use strict'

const mongoose = require('mongoose')
const schema = require('./courseSchema')

const CourseModel = mongoose.model('Course', schema)

module.exports = {
  CourseModel,
}
