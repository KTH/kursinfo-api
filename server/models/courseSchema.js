'use strict'

const mongoose = require('mongoose')
const { safeGet } = require('safe-utils')
const sanitize = require('./../lib/sanitizeHtml')

module.exports = mongoose.Schema({
  // _id: { type: String, required: true, trim: true },
  courseCode: {
    type: String,
    required: [true, 'Enter Course Code']
  },
  sellingText_en: {
    type: String,
    required: [false, 'If sellingText is added then short text will be hidden.'],
    trim: true,
    minlength: 0,
    maxlength: [10000, 'Text must have at most 5000 characters.'],
    default: ''
  },
  sellingText_sv: {
    type: String,
    required: [false, 'If sellingText is added then short text will be hidden.'],
    trim: true,
    minlength: 0,
    maxlength: [10000, 'Text must have at most 5000 characters.'],
    default: ''
  },
  imageInfo: {
    type: String,
    required: false,
    trim: true,
    default: ''
  },
  isCourseWebLink: {
    type: Boolean,
    required: false,
    default: false
  },
  sellingTextAuthor: {
    type: String,
    required: [false, 'If sellingText is added then short text will be hidden.'],
    trim: true,
    minlength: 0,
    maxlength: [10, 'Text must have at most 10 characters.'],
    default: ''
  }
}, { collection: 'courses-data', toJSON: { virtuals: true }, id: false })

module.exports.pre('save', function (next) {
  if (this.sellingText_en) {
    if (safeGet(() => this.sellingText_en)) {
      this.sellingText_en = sanitize(this.sellingText_en)
    }
  }
  if (this.sellingText_sv) {
    if (safeGet(() => this.sellingText_sv)) {
      this.sellingText_sv = sanitize(this.sellingText_sv)
    }
  }
  next()
})
