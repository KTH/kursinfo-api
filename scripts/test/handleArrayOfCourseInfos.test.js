jest.mock('@kth/log')
const log = require('@kth/log')

const { handleArrayOfCourseInfos } = require('../importData/handleArrayOfCourseInfos')

jest.mock('../importData/updateOrCreate')
const { updateOrCreate } = require('../importData/updateOrCreate')

const courseInfos = [
  {
    courseCode: 'SF1610',
    supplementaryInfo_sv: 'supplementaryInfo_sv',
    supplementaryInfo_en: 'supplementaryInfo_en',
    courseDisposition_sv: 'courseDisposition_sv',
    courseDisposition_en: 'courseDisposition_en',
  },
  {
    courseCode: 'SF1625',
    supplementaryInfo_sv: 'supplementaryInfo_sv',
    supplementaryInfo_en: 'supplementaryInfo_en',
    courseDisposition_sv: 'courseDisposition_sv',
    courseDisposition_en: 'courseDisposition_en',
  },
  {
    courseCode: 'SF1635',
    supplementaryInfo_sv: 'supplementaryInfo_sv',
    supplementaryInfo_en: 'supplementaryInfo_en',
    courseDisposition_sv: 'courseDisposition_sv',
    courseDisposition_en: 'courseDisposition_en',
  },
]

const returnedFromUpdateOrCreate = {
  courseCode: 'someCourseCode',
  success: true,
}

describe('handleArrayOfCourseInfos', () => {
  beforeEach(() => {
    updateOrCreate.mockResolvedValue(returnedFromUpdateOrCreate)
  })
  test('calls updateOrCreate with courseInfos', async () => {
    await handleArrayOfCourseInfos(courseInfos)

    expect(updateOrCreate).toHaveBeenNthCalledWith(1, courseInfos[0])
    expect(updateOrCreate).toHaveBeenNthCalledWith(2, courseInfos[1])
    expect(updateOrCreate).toHaveBeenNthCalledWith(3, courseInfos[2])
  })

  test('returns an array of same length as input array', async () => {
    const result = await handleArrayOfCourseInfos([1, 2, 3, 4, 5, 6, 7, 8, 9])

    expect(result.length).toBe(9)
  })

  test('returns responses from updateOrCreate', async () => {
    const result = await handleArrayOfCourseInfos([courseInfos[0]])

    expect(result).toEqual([returnedFromUpdateOrCreate])
  })
})
