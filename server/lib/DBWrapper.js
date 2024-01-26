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

module.exports = {
  getExistingDocOrNewOne,
}
