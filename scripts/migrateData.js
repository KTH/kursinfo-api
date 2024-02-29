const fs = require('fs')
const csvParser = require('csv-parser')
const { filterEmptyCourseInfos } = require('./filterEmptyCourseInfos')
const { handleArrayOfCourseInfos } = require('./handleArrayOfCourseInfos')
const log = require('@kth/log')

const setup = () => {
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

  require('./database').connect()
}

// const cleanFile = () => {
//   const someFile = './2024-02-20-data.csv'
//   const outputFile = './2024-02-20-data-clean.csv'
//   fs.readFile(someFile, 'utf8', function (err, data) {
//     if (err) {
//       return log.info(err)
//     }
//     var result = data.replaceAll(/;+$/gm, '')

//     fs.writeFile(outputFile, result, 'utf8', function (err) {
//       if (err) return log.info(err)
//     })
//   })
// }

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
  // const filteredList = [
  //   {
  //     courseCode: 'SF1625',
  //     supplementaryInfo_sv: 'supplementaryInfo_sv_1',
  //     supplementaryInfo_en: 'supplementaryInfo_en_1',
  //     courseDisposition_sv: 'courseDisposition_sv_1',
  //     courseDisposition_en: 'courseDisposition_en_1',
  //   },
  // ]

  log.info(`Extracted ${filteredList.length} courses with non-empty texts`)

  // const firstTen = filteredList.slice(0, 1)
  // firstTen.forEach(({ courseCode }) => {
  //   log.info(courseCode)
  // })
  // const result = await handleArrayOfCourseInfos(firstTen)

  const result = await handleArrayOfCourseInfos(filteredList)

  const successful = result.filter(({ success }) => success)
  const failed = result.filter(({ success }) => !success)

  log.info('-------')
  log.info(`Handled ${result.length} courseInfos`)
  log.info(`${successful.length} successful`)
  log.info(`${failed.length} failed`)
  log.info('-------')

  if (failed.length) {
    log.info('Failed attempts:')
    log.info(failed)
  }
}

setup()
handleCSV('./2024-02-29-data.csv')
