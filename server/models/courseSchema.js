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
  imageInfo: { // TODO: om URL sanitize it
    type: String,
    required: false,
    trim: true
  },
  isCourseWebLink: {
    type: Boolean,
    required: false,
    default: false
  },
  sellingTextAuthor_sv: {
    type: String,
    required: [false, 'If sellingText is added then short text will be hidden.'],
    trim: true,
    minlength: 0,
    maxlength: [10, 'Text must have at most 10 characters.'],
    default: ''
  },
  sellingTextAuthor_en: {
    type: String,
    required: [false, 'If sellingText is added then short text will be hidden.'],
    trim: true,
    minlength: 0,
    maxlength: [10, 'Text must have at most 10 characters.'],
    default: ''
  }
}, { collection: 'courses-data', toJSON: { virtuals: true }, id: false })

// module.exports.pre('validate', function (next) {
//   if (this.sellingText) {
//     ['sv', 'en'].forEach(lang => {
//       if (safeGet(() => this.description[lang])) {
//         this.description[lang] = sanitize(this.description[lang])
//       }
//     })
//   }
//   next()
// })
