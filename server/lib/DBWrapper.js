const { CourseModel } = require('../models/courseModel')

const getExistingDocOrNewOne = async courseCode => {
  const exists = await CourseModel.findOne({ courseCode: courseCode.toUpperCase() })

  if (exists) {
    return exists
  } else {
    return new CourseModel({ courseCode: courseCode.toUpperCase() })
  }
}

const getDoc = async courseCode => {
  let doc = await CourseModel.findOne({ courseCode: courseCode.toUpperCase() })
  return doc
}

const createDoc = async courseInfo => CourseModel.create(courseInfo)

const updateDoc = async (courseCode, newInfo) =>
  CourseModel.updateOne({ courseCode: courseCode.toUpperCase() }, newInfo)

module.exports = {
  getExistingDocOrNewOne,
  getDoc,
  createDoc,
  updateDoc,
}
