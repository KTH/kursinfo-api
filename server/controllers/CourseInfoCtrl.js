const log = require('@kth/log')
const { getDoc, createDoc, updateDoc } = require('../lib/DBWrapper')
const { toDBFormat, toClientFormat } = require('../util/CourseInfoMapper')

const getCourseInfoByCourseCode = async (req, res) => {
  const courseCode = req.params.courseCode
  if (!courseCode) return res.status(400).send("Missing parameter 'courseCode'")

  try {
    let doc = {}
    doc = await getDoc(courseCode)

    if (!doc) {
      log.info(`No entry found for courseCode: ${courseCode}`)
      return res.sendStatus(404)
    }

    log.info('Successfully fetched CourseInfo for courseCode: ', doc.courseCode)
    const clientResponse = toClientFormat(doc)
    return res.status(200).send(clientResponse)
  } catch (err) {
    log.error('Failed fetching courseInfo', { err })
    return err
  }
}

const postCourseInfo = async (req, res) => {
  if (!req.body) return res.status(400).send('Missing request body')

  const courseCode = req.body.courseCode
  if (!courseCode) return res.status(400).send("Missing parameter 'courseCode'")

  try {
    const doc = await getDoc(courseCode)
    if (doc) {
      return res.status(409).send(`CourseInfo for courseCode '${courseCode}' already exists. Use PATCH instead.`)
    }
    const docDBFormat = toDBFormat(req.body)
    await createDoc(docDBFormat)
    const newEntry = toClientFormat(docDBFormat)
    return res.status(201).send(newEntry)
  } catch (err) {
    log.error({ err, courseCode }, 'Error when contacting database')
    return err
  }
}

const patchCourseInfoByCourseCode = async (req, res) => {
  const courseCode = req.params?.courseCode
  if (!courseCode) return res.status(400).send("Missing path parameter 'courseCode'")

  if (!req.body) return res.status(400).send('Missing request body')

  if (Object.keys(req.body).length === 0) return res.status(400).send('Empty request body')

  try {
    const originalDoc = await getDoc(courseCode)
    if (!originalDoc) {
      return res.status(404).send(`CourseInfo for courseCode '${courseCode}' does not exist. Use POST instead.`)
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
    return err
  }
}

module.exports = {
  getCourseInfoByCourseCode,
  postCourseInfo,
  patchCourseInfoByCourseCode,
}
