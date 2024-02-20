const { getDoc, updateDoc } = require('../../server/lib/DBWrapper')

jest.mock('../../server/models/courseModel')
const { CourseModel } = require('../../server/models/courseModel')

describe('getDoc', () => {
  beforeEach(() => {
    CourseModel.mockImplementation(obj => {
      return { obj, findOne: jest.fn() }
    })
  })
  test('calls courseModel.findOne with courseCode', () => {
    getDoc('SF1624')
    expect(CourseModel.findOne).toHaveBeenCalledWith({ courseCode: 'SF1624' })
  })
  test('calls courseModel.findOne with uppercase courseCode', () => {
    getDoc('sf1624')
    expect(CourseModel.findOne).toHaveBeenCalledWith({ courseCode: 'SF1624' })
  })
  test('returns null if entry not found', () => {
    CourseModel.findOne.mockResolvedValueOnce(null)
    const result = getDoc('SF1624')
    expect(result).resolves.toEqual(null)
  })
  test('returns document if found', () => {
    CourseModel.findOne.mockResolvedValueOnce({ courseCode: 'SF1624' })
    const result = getDoc('SF1624')
    expect(result).resolves.toEqual({ courseCode: 'SF1624' })
  })
})

describe('updateDoc', () => {
  beforeEach(() => {
    CourseModel.mockImplementation(obj => {
      return { obj, updateOne: jest.fn() }
    })
  })
  test('calls updateOne with input as filter object', () => {
    updateDoc('SF1624', { imageInfo: 'updated image info' })
    expect(CourseModel.updateOne).toHaveBeenCalledWith({ courseCode: 'SF1624' }, { imageInfo: 'updated image info' })
  })
})
