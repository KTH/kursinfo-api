const { updateDoc, createDoc, getDoc } = require('../../server/lib/DBWrapper')

const updateOrCreate = async courseInfo => {
  const courseCode = courseInfo.courseCode.toUpperCase()

  let operation = 'none'
  try {
    const courseInfoExists = await getDoc(courseCode)

    if (!courseInfoExists) {
      operation = 'create'
      await create(courseInfo)
    } else {
      operation = 'update'
      await update(courseInfo)
    }
  } catch (error) {
    const { message, stack } = error
    return {
      courseCode,
      success: false,
      message,
      stack,
      operation,
    }
  }

  return {
    courseCode,
    success: true,
    operation,
  }
}

const update = async courseInfo => {
  const { courseCode, ...courseInfoWithoutCourseCode } = courseInfo
  const { acknowledged } = await updateDoc(courseCode, courseInfoWithoutCourseCode)

  if (!acknowledged) {
    throw new Error('Something went wrong while updating')
  }
}

const create = async courseInfo => {
  const properCourseInfo = { ...courseInfo, courseCode: courseInfo.courseCode.toUpperCase() }

  const creationSucceeded = await createDoc(properCourseInfo)
  if (!creationSucceeded) {
    throw new Error('Something went wrong while creating')
  }
}

module.exports = {
  updateOrCreate,
}
