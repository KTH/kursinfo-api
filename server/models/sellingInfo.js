'use strict'

/**
 * Kursinfo API model for selling course info which can be edited by admins.
 */

const mongoose = require('mongoose')

const sellingInfoSchema = mongoose.Schema({
  courseCode: {
    type: String,
    required: [true, 'Enter Course Code']
  },
  sellingText: {
    type: String,
    required: [false, 'If sellingText is added then short text will be hidden.'],
    trim: true,
    maxlength: [2000, 'Text must have at most 2000 characters.'],
    default: ''
  }/*,
  language: String */
})

const SellingInfo = mongoose.model('sellingInfoSchema', sellingInfoSchema)

module.exports = {
  SellingInfo: SellingInfo,
  sellingInfoSchema: sellingInfoSchema
}
