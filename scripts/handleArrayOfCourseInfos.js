const log = require('@kth/log')
const { updateOrCreate } = require('./updateOrCreate')

const handleArrayOfCourseInfos = async courseInfos => {
  // What does map do in this case?
  // will
  // Test against local first

  // filter out empty texts first
  // after: filter success/fail and write to file
  // add error messages

  log.info(`------Starting to import ${courseInfos.length} courseInfos`)

  const results = []

  for (let index = 0; index < courseInfos.length; index++) {
    const courseInfo = courseInfos[index]

    log.info(`starting update of ${courseInfo.courseCode} (${index + 1}/${courseInfos.length})`)

    const result = await updateOrCreate(courseInfo)

    log.info(
      `done with ${result.courseCode}, operation: ${result.operation}, success: ${result.success}`,
      result.message ?? '',
      result.stack ?? ''
    )

    results.push(result)
  }

  return results
}

module.exports = {
  handleArrayOfCourseInfos,
}
