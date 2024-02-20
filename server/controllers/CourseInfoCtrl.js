const log = require('@kth/log')
const { getExistingDocOrNewOne, getDoc, createDoc, updateDoc } = require('../lib/DBWrapper')
const { toDBFormat, toClientFormat } = require('../util/CourseInfoMapper')

const getCourseInfoByCourseCode = async (req, res) => {
  const courseCode = req.params.courseCode
  if (!courseCode) return res.send(400, "Missing parameter 'courseCode'")

  try {
    let doc = {}
    doc = await getDoc(courseCode)
    if (doc) {
      log.info('Successfully fetched CourseInfo for courseCode: ', doc.courseCode, 'Data: ', doc)
      const clientResponse = toClientFormat(doc)
      return res.send(201, clientResponse)
    } else {
      log.info(`No entry found for courseCode: ${courseCode}`)
      return res.send(404)
    }
  } catch (err) {
    log.error('Failed fetching courseInfo', { err })
    return err
  }
}

const postCourseInfo = async (req, res) => {
  if (!req.body) return res.send(400, 'Missing request body')

  const courseCode = req.body.courseCode
  if (!courseCode) return res.send(400, "Missing parameter 'courseCode'")

  try {
    const doc = await getDoc(courseCode)
    if (doc) {
      return res.send(409, `CourseInfo for courseCode '${courseCode}' already exists. Use PATCH instead.`)
    }
    const docDBFormat = toDBFormat(req.body)
    await createDoc(docDBFormat)
    const newEntry = toClientFormat(docDBFormat)
    return res.send(201, newEntry)
  } catch (err) {
    log.error({ err, courseCode }, 'Error when contacting database')
    return err
  }
}

const patchCourseInfoByCourseCode = async (req, res) => {
  if (!req.body) return res.send(400, 'Missing request body')

  const courseCode = req.body.courseCode
  if (!courseCode) return res.send(400, "Missing parameter 'courseCode'")

  try {
    const originalDoc = await getDoc(courseCode)
    if (!originalDoc) {
      return res.send(404, `CourseInfo for courseCode '${courseCode}' does not exist. Use POST instead.`)
    }

    const updatedFields = toDBFormat(req.body)

    const updateResponse = await updateDoc(courseCode, updatedFields)

    if (!updateResponse.acknowledged) {
      throw new Error('Failed updating entry: ', courseCode)
    }

    const updatedDoc = await getDoc(courseCode)

    const clientFormatUpdatedDoc = toClientFormat(updatedDoc)
    return res.send(201, clientFormatUpdatedDoc)
  } catch (err) {
    log.error({ err, courseCode }, 'Error when contacting database')
    return err
  }
}

module.exports = {
  getCourseInfoByCourseCode,
  postCourseInfo,
  patchCourseInfoByCourseCode,
}
