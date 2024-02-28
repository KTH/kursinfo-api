const { CourseModel } = require('../models/courseModel')

const getDoc = async courseCode => {
  let doc = await CourseModel.findOne({ courseCode: courseCode.toUpperCase() })
  return doc
}

const createDoc = async courseInfo => CourseModel.create(courseInfo)

const updateDoc = async (courseCode, newInfo) =>
  CourseModel.updateOne({ courseCode: courseCode.toUpperCase() }, newInfo)

module.exports = {
  getDoc,
  createDoc,
  updateDoc,
}
