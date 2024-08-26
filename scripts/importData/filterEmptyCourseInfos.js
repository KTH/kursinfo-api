const filterEmptyCourseInfos = courseInfos => {
  const EMPTY_VALUES = ['', 'NULL']

  return courseInfos.filter(({ courseCode, prerequisites_sv, prerequisites_en }) => {
    if (!courseCode) {
      return false
    }
    if (EMPTY_VALUES.includes(prerequisites_sv) && EMPTY_VALUES.includes(prerequisites_en)) {
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
