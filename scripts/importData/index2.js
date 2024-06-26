const log = require('@kth/log')
const { filterEmptySupplementaryInfos } = require('./filterEmptyCourseInfos')
const { handleArrayOfCourseInfos } = require('./handleArrayOfCourseInfos')
const { sortCourseInfos } = require('../utils/compareTerms')
const { readCSV, setupLogging, setupDatabase, tryToGetPathToFileFromParams } = require('./utils')

const csvConfig = {
  separator: ',',
  headers: [
    'courseCode',
    'state',
    'title_sv',
    'valid_from_term',
    'validToTerm',
    'courseDisposition_sv',
    'courseDisposition_en',
    'supplementaryInfo_sv',
    'supplementaryInfo_en',
  ],
}

const handleCSV = async file => {
  const rawCSV = await readCSV(file, csvConfig)

  log.info(`Found ${rawCSV.length} courses over all.`)

  const onlyCancelled = rawCSV.filter(({ state }) => state === 'CANCELLED')

  log.info(`Found ${onlyCancelled.length} cancelled courses.`)

  const filteredList = filterEmptySupplementaryInfos(onlyCancelled)

  log.info(`Found ${filteredList.length} courses with non-empty supplementaryInfos.`)

  const distinctCourseCodes = filteredList.reduce((courseCodes, { courseCode }) => {
    if (!courseCodes.includes(courseCode)) {
      courseCodes.push(courseCode)
    }
    return courseCodes
  }, [])

  log.info(`Found ${distinctCourseCodes.length} distinct courseCodes.`)

  const courseInfosByCourseCode = distinctCourseCodes.map(courseCode => {
    return filteredList.filter(courseInfo => courseInfo.courseCode === courseCode)
  })

  const latestCourseInfos = courseInfosByCourseCode.map(courseInfos => {
    const { courseCode, supplementaryInfo_sv, supplementaryInfo_en } = sortCourseInfos(courseInfos)[0]

    // THIS IS IMPORTANT!
    // Here we choose the fields that will be written into the DB
    return {
      courseCode,
      supplementaryInfo_sv: emptyStringIfNull(supplementaryInfo_sv),
      supplementaryInfo_en: emptyStringIfNull(supplementaryInfo_en),
    }
  })

  log.info(`Found ${latestCourseInfos.length} latest courseInfos.`)

  const result = await handleArrayOfCourseInfos(latestCourseInfos)

  const successful = result.filter(({ success }) => success)
  const failed = result.filter(({ success }) => !success)

  const updated = result.filter(({ operation }) => operation === 'update').map(({ courseCode }) => courseCode)

  log.info('-------')
  log.info(`Extracted ${rawCSV.length} courses over all`)
  log.info(`Extracted ${onlyCancelled.length} cancelled courses.`)
  log.info(`Extracted ${filteredList.length} courses with non-empty texts`)
  log.info(`Handled ${result.length} courseInfos`)
  log.info(`${successful.length} successful`)
  log.info(`${failed.length} failed`)
  log.info(`Updated courses: ${updated.join(', ')}`)
  log.info('-------')

  if (failed.length) {
    log.info('Failed attempts:')
    log.info(failed)
  }
}

const emptyStringIfNull = text => (text === 'NULL' ? '' : text)

const run = () => {
  setupLogging()

  const pathToFile = tryToGetPathToFileFromParams()

  setupDatabase()

  handleCSV(pathToFile)
}

run()
