const { CourseModel } = require('../models/courseModel')

const getExistingDocOrNewOne = async courseCode => {
  let exists = {}
  exists = await CourseModel.findOne({ courseCode: courseCode.toUpperCase() })

  if (exists) {
    return exists
  } else {
    return new CourseModel({ courseCode: courseCode.toUpperCase() })
  }
}

const getDoc = async courseCode => {
  console.log(courseCode, 'courseCode in Dbwrapper')
  let doc = await CourseModel.findOne({ courseCode: courseCode.toUpperCase() }).exec()
  return doc
}

module.exports = {
  getExistingDocOrNewOne,
  getDoc,
}
