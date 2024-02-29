const filterEmptyCourseInfos = courseInfos => {
  return courseInfos.filter(
    ({ courseCode, supplementaryInfo_sv, supplementaryInfo_en, courseDisposition_sv, courseDisposition_en }) => {
      if (!courseCode) {
        return false
      }
      if (!supplementaryInfo_sv && !supplementaryInfo_en && !courseDisposition_sv && !courseDisposition_en) {
        return false
      }
      return true
    }
  )
}

module.exports = {
  filterEmptyCourseInfos,
}
