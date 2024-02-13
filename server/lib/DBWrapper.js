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
  console.log(courseCode, 'courseCode in Dbwrapper')
  let doc = await CourseModel.findOne({ courseCode: courseCode.toUpperCase() }).exec()
  return doc
}

const createDoc = async courseInfo => CourseModel.create(courseInfo)

const updateDoc = async (courseCode, newInfo) => CourseModel.updateOne({ courseCode }, newInfo)

module.exports = {
  getExistingDocOrNewOne,
  getDoc,
  createDoc,
  updateDoc,
}
