'use strict'

const mongoose = require('mongoose')
const { safeGet } = require('safe-utils')
const sanitize = require('../lib/sanitizeHtml')

module.exports = mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: [true, 'Enter Course Code'],
    },
    sellingText_en: {
      type: String,
      required: [false, 'If sellingText is added then short text will be hidden.'],
      trim: true,
      minlength: 0,
      maxlength: [10000, 'Text must have at most 5000 characters.'],
      default: '',
    },
    sellingText_sv: {
      type: String,
      required: [false, 'If sellingText is added then short text will be hidden.'],
      trim: true,
      minlength: 0,
      maxlength: [10000, 'Text must have at most 5000 characters.'],
      default: '',
    },
    imageInfo: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    isCourseWebLink: {
      // This field is no longer in use as of KUI-1245. It is retained in this schema file, because it is not removed from the DB.
      type: Boolean,
      required: false,
      default: false,
    },
    sellingTextAuthor: {
      type: String,
      required: [false, 'If sellingText is added then short text will be hidden.'],
      trim: true,
      minlength: 0,
      maxlength: [10, 'Text must have at most 10 characters.'],
      default: '',
    },
    supplementaryInfo_en: {
      type: String,
      required: [false, 'If supplementaryInfo is added then short text will be hidden.'],
      trim: true,
      minlength: 0,
      maxlength: [10000, 'Text must have at most 5000 characters.'],
      default: '',
    },
    supplementaryInfo_sv: {
      type: String,
      required: [false, 'If supplementaryInfo is added then short text will be hidden.'],
      trim: true,
      minlength: 0,
      maxlength: [10000, 'Text must have at most 5000 characters.'],
      default: '',
    },
    courseDisposition_en: {
      type: String,
      required: [false, 'If courseDisposition is added then short text will be hidden.'],
      trim: true,
      minlength: 0,
      maxlength: [10000, 'Text must have at most 5000 characters.'],
      default: '',
    },
    courseDisposition_sv: {
      type: String,
      required: [false, 'If courseDisposition is added then short text will be hidden.'],
      trim: true,
      minlength: 0,
      maxlength: [10000, 'Text must have at most 5000 characters.'],
      default: '',
    },
  },
  { collection: 'courses-data', toJSON: { virtuals: true }, id: false }
)

module.exports.pre('save', next => {
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
  if (this.courseDisposition_sv) {
    if (safeGet(() => this.courseDisposition_sv)) {
      this.courseDisposition_sv = sanitize(this.courseDisposition_sv)
    }
  }
  if (this.courseDisposition_en) {
    if (safeGet(() => this.courseDisposition_en)) {
      this.courseDisposition_en = sanitize(this.courseDisposition_en)
    }
  }
  if (this.supplementaryInfo_sv) {
    if (safeGet(() => this.supplementaryInfo_sv)) {
      this.supplementaryInfo_sv = sanitize(this.supplementaryInfo_sv)
    }
  }
  if (this.supplementaryInfo_en) {
    if (safeGet(() => this.supplementaryInfo_en)) {
      this.supplementaryInfo_en = sanitize(this.supplementaryInfo_en)
    }
  }
  next()
})
