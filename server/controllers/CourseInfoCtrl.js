const log = require('@kth/log')
const { getExistingDocOrNewOne } = require('../lib/DBWrapper')

const putCourseInfoByCourseCode = async (req, res) => {
  const courseCode = req.params.courseCode
  const body = req.body

  if (!courseCode) {
    return res.send(400, "Missing parameter 'courseCode'")
  }

  if (Object.keys(body).length === 0) {
    return res.send(400, 'Missing request body')
  }
  log.info('Saving for a course: ', courseCode.toUpperCase(), 'Data: ', req.body)

  try {
    const {
      sellingText: sellingTexts,
      sellingTextAuthor,
      imageInfo,
      supplementaryInfo: supplementaryInfos,
      courseDisposition: courseDispositions,
    } = body

    const doc = await getExistingDocOrNewOne(courseCode)

    doc.imageInfo = imageInfo
    doc.sellingText_en = sellingTexts?.en
    doc.sellingText_sv = sellingTexts?.sv
    doc.sellingTextAuthor = sellingTextAuthor
    doc.supplementaryInfo_en = supplementaryInfos?.en
    doc.supplementaryInfo_sv = supplementaryInfos?.sv
    doc.courseDisposition_en = courseDispositions?.en
    doc.courseDisposition_sv = courseDispositions?.sv

    await doc.save()

    const responseObject = {
      courseCode: doc.courseCode.toUpperCase(),
      imageInfo: doc.imageInfo,
      sellingText_en: sellingTexts.en,
      sellingText_sv: sellingTexts.sv,
      sellingTextAuthor: doc.sellingTextAuthor,
      supplementaryInfo_en: supplementaryInfos.en,
      supplementaryInfo_sv: supplementaryInfos.sv,
      courseDisposition_en: courseDispositions.en,
      courseDisposition_sv: courseDispositions.sv,
    }

    log.info('Successfully saved for courseCode: ', doc.courseCode, 'Data: ', responseObject)

    return res.send(201, responseObject)
  } catch (err) {
    log.error('Failed posting courseInfo', { err })
    return err
  }
}

module.exports = {
  putCourseInfoByCourseCode,
}
