const log = require('@kth/log')
const { filterEmptyCourseInfos } = require('./filterEmptyCourseInfos')
const { handleArrayOfCourseInfos } = require('./handleArrayOfCourseInfos')
const { readCSV, setupLogging, setupDatabase, tryToGetPathToFileFromParams } = require('./utils')

const csvConfig = {
  separator: ';',
  headers: [
    'courseCode',
    'courseDisposition_sv',
    'courseDisposition_en',
    'recommendedPrerequisites_sv',
    'recommendedPrerequisites_en',
    'supplementaryInfo_sv',
    'supplementaryInfo_en',
  ],
}

const handleCSV = async file => {
  const rawCSV = await readCSV(file, csvConfig)

  log.info(`Extracted ${rawCSV.length} courses over all`)

  const filteredList = filterEmptyCourseInfos(rawCSV)

  log.info(`Extracted ${filteredList.length} courses with non-empty texts`)

  const result = await handleArrayOfCourseInfos(filteredList)

  const successful = result.filter(({ success }) => success)
  const failed = result.filter(({ success }) => !success)

  log.info('-------')
  log.info(`Extracted ${rawCSV.length} courses over all`)
  log.info(`Extracted ${filteredList.length} courses with non-empty texts`)
  log.info(`Handled ${result.length} courseInfos`)
  log.info(`${successful.length} successful`)
  log.info(`${failed.length} failed`)
  log.info('-------')

  if (failed.length) {
    log.info('Failed attempts:')
    log.info(failed)
  }
}

const run = () => {
  setupLogging()

  const pathToFile = tryToGetPathToFileFromParams()

  setupDatabase()

  handleCSV(pathToFile)
}

run()
