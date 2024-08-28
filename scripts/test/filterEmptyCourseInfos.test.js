const { recommendedPrerequisites_sv } = require('../../server/models/courseSchema')
const {
  filterEmptyCourseInfos,
  filterEmptySupplementaryInfos,
  filterEmptyPrerequisites,
} = require('../importData/filterEmptyCourseInfos')

const filteredCourseInfos = [
  {
    courseCode: 'sf1610',
    supplementaryInfo_sv: 'supplementaryInfo_sv_1',
    supplementaryInfo_en: 'supplementaryInfo_en_1',
    courseDisposition_sv: 'courseDisposition_sv_1',
    courseDisposition_en: 'courseDisposition_en_1',
  },
  {
    courseCode: 'cs2001',
    supplementaryInfo_sv: 'supplementaryInfo_sv_2',
    supplementaryInfo_en: '',
    courseDisposition_sv: '',
    courseDisposition_en: '',
  },
  {
    courseCode: 'math3001',
    supplementaryInfo_sv: '',
    supplementaryInfo_en: 'supplementaryInfo_en_3',
    courseDisposition_sv: '',
    courseDisposition_en: '',
  },
  {
    courseCode: 'eng4001',
    supplementaryInfo_sv: '',
    supplementaryInfo_en: '',
    courseDisposition_sv: 'courseDisposition_sv_4',
    courseDisposition_en: '',
  },
  {
    courseCode: 'phy5001',
    supplementaryInfo_sv: '',
    supplementaryInfo_en: '',
    courseDisposition_sv: '',
    courseDisposition_en: 'courseDisposition_en_5',
  },
]

const filteredSupplementaryInfos = [
  {
    courseCode: 'sf1610',
    supplementaryInfo_sv: 'supplementaryInfo_sv_1',
    supplementaryInfo_en: 'supplementaryInfo_en_1',
    courseDisposition_sv: 'courseDisposition_sv_1',
    courseDisposition_en: 'courseDisposition_en_1',
  },
  {
    courseCode: 'cs2001',
    supplementaryInfo_sv: 'supplementaryInfo_sv_2',
    supplementaryInfo_en: '',
    courseDisposition_sv: '',
    courseDisposition_en: '',
  },
  {
    courseCode: 'math3001',
    supplementaryInfo_sv: '',
    supplementaryInfo_en: 'supplementaryInfo_en_3',
    courseDisposition_sv: '',
    courseDisposition_en: '',
  },
]
const filteredPrerequisites = [
  {
    courseCode: 'chem6002',
    recommendedPrerequisites_sv: 'recommendedPrerequisites_sv_2',
    recommendedPrerequisites_en: 'recommendedPrerequisites_en_2',
  },
  {
    courseCode: 'chem6003',
    recommendedPrerequisites_sv: 'recommendedPrerequisites_sv_3',
    recommendedPrerequisites_en: 'recommendedPrerequisites_en_3',
  },
  {
    courseCode: 'chem6004',
    recommendedPrerequisites_sv: 'recommendedPrerequisites_sv_4',
    recommendedPrerequisites_en: 'NULL',
  },
]

const unfilteredCourseInfos = [
  ...filteredCourseInfos,
  {
    courseCode: 'chem6001',
    supplementaryInfo_sv: '',
    supplementaryInfo_en: '',
    courseDisposition_sv: '',
    courseDisposition_en: '',
  },
  {
    courseCode: '',
    supplementaryInfo_sv: '',
    supplementaryInfo_en: '',
    courseDisposition_sv: '',
    courseDisposition_en: '',
  },
  {
    courseCode: '',
    supplementaryInfo_sv: 'supplementaryInfo_sv',
    supplementaryInfo_en: '',
    courseDisposition_sv: '',
    courseDisposition_en: '',
  },
]

const unfilteredSupplementaryInfos = [
  ...unfilteredCourseInfos,
  {
    courseCode: 'chem6001',
    supplementaryInfo_sv: 'NULL',
    supplementaryInfo_en: '',
    courseDisposition_sv: '',
    courseDisposition_en: '',
  },
  {
    courseCode: 'chem6001',
    supplementaryInfo_sv: '',
    supplementaryInfo_en: 'NULL',
    courseDisposition_sv: '',
    courseDisposition_en: '',
  },
]
const unfilteredPrerequisites = [
  {
    courseCode: 'chem6001',
    recommendedPrerequisites_sv: 'NULL',
    recommendedPrerequisites_en: '',
  },
  {
    courseCode: 'chem6002',
    recommendedPrerequisites_sv: 'recommendedPrerequisites_sv_2',
    recommendedPrerequisites_en: 'recommendedPrerequisites_en_2',
  },
  {
    courseCode: 'chem6003',
    recommendedPrerequisites_sv: 'recommendedPrerequisites_sv_3',
    recommendedPrerequisites_en: 'recommendedPrerequisites_en_3',
  },
  {
    courseCode: 'chem6004',
    recommendedPrerequisites_sv: 'recommendedPrerequisites_sv_4',
    recommendedPrerequisites_en: 'NULL',
  },
  {
    courseCode: 'chem6004',
    recommendedPrerequisites_sv: '',
    recommendedPrerequisites_en: '',
  },
]

describe('filterEmptyCourseInfos', () => {
  test('filters courseInfos', () => {
    const result = filterEmptyCourseInfos(unfilteredCourseInfos)

    expect(result).toEqual(filteredCourseInfos)
  })
})

describe('filterEmptySupplementaryInfos', () => {
  test('filters courseInfos', () => {
    const result = filterEmptySupplementaryInfos(unfilteredSupplementaryInfos)

    expect(result).toEqual(filteredSupplementaryInfos)
  })
})
describe('filterEmptyPrerequisites', () => {
  test('filters recommendedPrerequisites', () => {
    const result = filterEmptyPrerequisites(unfilteredPrerequisites)

    expect(result).toEqual(filteredPrerequisites)
  })
})
