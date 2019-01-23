// 'use strict'

// const sanitize = require('sanitize-html')

// const opts = {
//   allowedTags: sanitize.defaults.allowedTags.concat([
//     's', 'img', 'figure', 'figcaption', 'iframe', 'span', 'h3', 'h2'
//   ]),
//   allowedAttributes: {
//     '*': ['style', 'data-*', 'class'],
//     'a': ['href', 'name', 'target'],
//     'img': ['src', 'alt', 'width', 'height'],
//     'iframe': ['src', 'frameborder', 'allowfullscreen', 'webkitallowfullscreen', 'mozallowfullscreen'],
//     'table': ['summary', 'border', 'cellspacing', 'cellpadding'],
//     'th': ['scope']
//   }
// }

// module.exports = function (html) {
//   return sanitize(html || '', opts)
// }

// module.exports.none = function (html) {
//   return sanitize(html || '', { allowedTags: [], allowedAttributes: [] })
// }
