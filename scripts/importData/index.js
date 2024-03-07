const fs = require('fs')
const csvParser = require('csv-parser')
const log = require('@kth/log')
const { filterEmptyCourseInfos } = require('./filterEmptyCourseInfos')
const { handleArrayOfCourseInfos } = require('./handleArrayOfCourseInfos')

const setupLogging = () => {
  let logConfiguration = {
    name: 'migrate-script',
    app: 'migrate-script',
    env: 'development',
    level: 'debug',
    console: undefined,
    stdout: undefined,
    src: undefined,
  }
  log.init(logConfiguration)
}

const tryToGetPathToFileFromParams = () => {
  if (process.argv.length === 2) {
    log.error('Please specify the path to the file you want to import into the database!')
    process.exit(1)
  }

  const pathToFile = process.argv[2]

  log.info(`Got '${pathToFile} as file to import.`)

  return pathToFile
}

const setupDatabase = () => {
  require('./database').connect()
}

const readCSV = async file => {
  return new Promise((resolve, reject) => {
    const result = []
    fs.createReadStream(file)
      .pipe(
        csvParser({
          separator: ';',
          headers: [
            'courseCode',
            'courseDisposition_sv',
            'courseDisposition_en',
            'supplementaryInfo_sv',
            'supplementaryInfo_en',
          ],
        })
      )
      .on('data', data => {
        result.push(data)
      })
      .on('end', () => {
        resolve(result)
      })
  })
}

const handleCSV = async file => {
  const rawCSV = await readCSV(file)

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
