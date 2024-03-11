const fs = require('fs')
const csvParser = require('csv-parser')
const log = require('@kth/log')

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

const readCSV = async (file, config) => {
  return new Promise((resolve, reject) => {
    const result = []
    fs.createReadStream(file)
      .pipe(csvParser(config))
      .on('data', data => {
        result.push(data)
      })
      .on('end', () => {
        resolve(result)
      })
  })
}

const setupDatabase = () => {
  require('./database').connect()
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

module.exports = {
  readCSV,
  setupLogging,
  setupDatabase,
  tryToGetPathToFileFromParams,
}
