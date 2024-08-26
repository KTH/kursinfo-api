const log = require('@kth/log')

const filterEmptyCourseInfos = courseInfos => {
  const EMPTY_VALUES = ['', 'NULL']

  return courseInfos.filter(({ courseCode, recommendedPrerequisites_sv, recommendedPrerequisites_en }) => {
    if (!courseCode) {
      return false
    }
    if (EMPTY_VALUES.includes(recommendedPrerequisites_sv) && EMPTY_VALUES.includes(recommendedPrerequisites_en)) {
      return false
    }
    return true
  })
}

const filterEmptySupplementaryInfos = courseInfos => {
  const EMPTY_VALUES = ['', 'NULL']

  return courseInfos.filter(({ courseCode, supplementaryInfo_sv, supplementaryInfo_en }) => {
    if (!courseCode) {
      return false
    }
    if (EMPTY_VALUES.includes(supplementaryInfo_sv) && EMPTY_VALUES.includes(supplementaryInfo_en)) {
      return false
    }
    return true
  })
}

module.exports = {
  filterEmptyCourseInfos,
  filterEmptySupplementaryInfos,
}
