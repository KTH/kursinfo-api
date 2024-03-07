const { filterEmptyCourseInfos } = require('../importData/filterEmptyCourseInfos')

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

describe('filterEmptyCourseInfos', () => {
  test('filters courseInfos', () => {
    const result = filterEmptyCourseInfos(unfilteredCourseInfos)

    expect(result).toEqual(filteredCourseInfos)
  })
})
