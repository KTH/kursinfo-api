const log = require('@kth/log')
const { getDoc, createDoc, updateDoc } = require('../lib/DBWrapper')
const { toDBFormat, toClientFormat } = require('../util/CourseInfoMapper')
const { HttpError } = require('./HttpError')

const getCourseInfoByCourseCode = async (req, res, next) => {
  try {
    const courseCode = req.params.courseCode
    if (!courseCode) throw new HttpError(400, "Missing parameter 'courseCode'")

    let doc = {}
    doc = await getDoc(courseCode)

    if (!doc) {
      log.info(`No entry found for courseCode: ${courseCode}`)
      throw new HttpError(404, `No entry found for courseCode: ${courseCode}`)
    }

    log.info('Successfully fetched CourseInfo for courseCode: ', doc.courseCode)
    const clientResponse = toClientFormat(doc)
    return res.status(200).send(clientResponse)
  } catch (err) {
    log.error('Failed fetching courseInfo', { err })
    return next(err)
  }
}

const postCourseInfo = async (req, res, next) => {
  const courseCode = req.body?.courseCode
  try {
    if (!req.body) throw new HttpError(400, 'Missing request body')

    if (!courseCode) throw new HttpError(400, "Missing parameter 'courseCode'")

    const doc = await getDoc(courseCode)
    if (doc) {
      throw new HttpError(409, `CourseInfo for courseCode '${courseCode}' already exists. Use PATCH instead.`)
    }
    const docDBFormat = toDBFormat(req.body)
    await createDoc(docDBFormat)
    const newEntry = toClientFormat(docDBFormat)
    return res.status(201).send(newEntry)
  } catch (err) {
    if (!(Object.hasOwn(err, 'isHttpError') && err.isHttpError))
      log.error({ err, courseCode }, 'Error when contacting database')
    return next(err)
  }
}

const patchCourseInfoByCourseCode = async (req, res, next) => {
  const courseCode = req.params?.courseCode
  try {
    if (!courseCode) throw new HttpError(400, "Missing path parameter 'courseCode'")

    if (!req.body) throw new HttpError(400, 'Missing request body')

    if (Object.keys(req.body).length === 0) throw new HttpError(400, 'Empty request body')

    const originalDoc = await getDoc(courseCode)
    if (!originalDoc) {
      throw new HttpError(404, `CourseInfo for courseCode '${courseCode}' does not exist. Use POST instead.`)
    }

    const updatedFields = toDBFormat(req.body, true)

    const updateResponse = await updateDoc(courseCode, updatedFields)

    if (!updateResponse.acknowledged) {
      throw new Error('Failed updating entry: ', courseCode)
    }

    const updatedDoc = await getDoc(courseCode)

    const clientFormatUpdatedDoc = toClientFormat(updatedDoc)
    return res.status(201).send(clientFormatUpdatedDoc)
  } catch (err) {
    log.error({ err, courseCode }, 'Error when contacting database')
    return next(err)
  }
}

module.exports = {
  getCourseInfoByCourseCode,
  postCourseInfo,
  patchCourseInfoByCourseCode,
}
