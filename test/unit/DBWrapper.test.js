const { getExistingDocOrNewOne } = require('../../server/lib/DBWrapper')

jest.mock('../../server/models/courseModel')
const { CourseModel } = require('../../server/models/courseModel')

describe('getExistingDocOrNewOne', () => {
  beforeEach(() => {
    CourseModel.mockImplementation(obj => {
      return { obj, findOne: jest.fn() }
    })
  })
  test('calls CourseModel.findOne with courseCode', () => {
    getExistingDocOrNewOne('SF1624')
    expect(CourseModel.findOne).toHaveBeenCalledWith({ courseCode: 'SF1624' })
  })
  test('calls CourseModel.findOne with uppercase courseCode', () => {
    getExistingDocOrNewOne('sf1624')
    expect(CourseModel.findOne).toHaveBeenCalledWith({ courseCode: 'SF1624' })
  })

  test('returns document if one is found', async () => {
    const doc = { courseCode: 'SF1624', sellingTexts_en: 'fooEN', sellingTexts_sv: 'fooSV' }
    CourseModel.findOne.mockImplementationOnce(() => {
      return Promise.resolve(doc)
    })

    const result = await getExistingDocOrNewOne('SF1624')

    expect(result).toEqual(doc)
  })

  test('if no document is found, createes a new document', async () => {
    await getExistingDocOrNewOne('SF1624')

    expect(CourseModel).toHaveBeenCalledWith({ courseCode: 'SF1624' })
  })
})
