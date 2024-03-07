const { updateOrCreate } = require('../importData/updateOrCreate')
jest.mock('../../server/lib/DBWrapper')
const { getDoc, updateDoc, createDoc } = require('../../server/lib/DBWrapper')

const oneCourseInfo = {
  courseCode: 'sf1610',
  supplementaryInfo_sv: 'supplementaryInfo_sv',
  supplementaryInfo_en: 'supplementaryInfo_en',
  courseDisposition_sv: 'courseDisposition_sv',
  courseDisposition_en: 'courseDisposition_en',
}

describe('updateOrCreate', () => {
  beforeEach(() => {
    getDoc.mockResolvedValue({ courseCode: 'someCourseCode' })
    createDoc.mockResolvedValue(true)
    updateDoc.mockResolvedValue({ acknowledged: true })
  })
  test('calls getDoc', async () => {
    await updateOrCreate(oneCourseInfo)

    expect(getDoc).toHaveBeenCalledWith(oneCourseInfo.courseCode.toUpperCase())
  })

  test('returns object containing courseCode', async () => {
    const result = await updateOrCreate(oneCourseInfo)

    expect(result).toEqual(expect.objectContaining({ courseCode: oneCourseInfo.courseCode.toUpperCase() }))
  })

  test('returns object containing success=false if getDoc rejects', async () => {
    getDoc.mockRejectedValueOnce(new Error('some Error'))

    const result = await updateOrCreate(oneCourseInfo)

    expect(result).toEqual(expect.objectContaining({ success: false }))
  })

  describe('if courseInfo does not exist in db', () => {
    beforeEach(() => {
      getDoc.mockResolvedValue(undefined)
    })

    test('if getDoc returns undefined, calls createDoc with courseInfo', async () => {
      await updateOrCreate(oneCourseInfo)

      const properCourseInfo = { ...oneCourseInfo, courseCode: oneCourseInfo.courseCode.toUpperCase() }

      expect(createDoc).toHaveBeenCalledWith(properCourseInfo)
    })

    test('if createDoc resolves falsy, returns object containing success=false and error message', async () => {
      createDoc.mockResolvedValueOnce(false)

      const result = await updateOrCreate(oneCourseInfo)

      expect(result).toEqual(expect.objectContaining({ success: false }))
      expect(result).toEqual(expect.objectContaining({ message: 'Something went wrong while creating' }))
    })

    test('if createDoc rejects, returns object containing success=false, operation=create, error message and stack', async () => {
      const error = new Error('some Error')
      error.stack = 'stack'
      createDoc.mockRejectedValueOnce(error)

      const result = await updateOrCreate(oneCourseInfo)

      expect(result).toEqual(expect.objectContaining({ success: false }))
      expect(result).toEqual(expect.objectContaining({ message: 'some Error' }))
      expect(result).toEqual(expect.objectContaining({ stack: 'stack' }))
      expect(result).toEqual(expect.objectContaining({ operation: 'create' }))
    })

    test('if createDoc resolves true, returns object containing success=true and operation=create', async () => {
      const result = await updateOrCreate(oneCourseInfo)
      expect(result).toEqual(expect.objectContaining({ success: true }))
      expect(result).toEqual(expect.objectContaining({ operation: 'create' }))
    })
  })

  describe('if courseInfo does exist in db', () => {
    test('calls updateDoc with courseCode and courseInfo w/o courseCode', async () => {
      await updateOrCreate(oneCourseInfo)

      const { courseCode, ...courseInfoWithoutCourseCode } = oneCourseInfo

      expect(updateDoc).toHaveBeenCalledWith(courseCode, courseInfoWithoutCourseCode)
    })

    test('if updateDoc resolves with acknowledged=false, returns object containing success=false, operation=update and error message', async () => {
      updateDoc.mockResolvedValueOnce({ acknowledged: false })
      const result = await updateOrCreate(oneCourseInfo)
      expect(result).toEqual(expect.objectContaining({ success: false }))
      expect(result).toEqual(expect.objectContaining({ message: 'Something went wrong while updating' }))
      expect(result).toEqual(expect.objectContaining({ operation: 'update' }))
    })

    test('if updateDoc rejects, returns object containing success=false, operation=update, error message and stack', async () => {
      const error = new Error('some Error')
      error.stack = 'stack'
      updateDoc.mockRejectedValueOnce(error)
      const result = await updateOrCreate(oneCourseInfo)
      expect(result).toEqual(expect.objectContaining({ success: false }))
      expect(result).toEqual(expect.objectContaining({ message: 'some Error' }))
      expect(result).toEqual(expect.objectContaining({ stack: 'stack' }))
      expect(result).toEqual(expect.objectContaining({ operation: 'update' }))
    })

    test('if updateDoc resolves with acknowledged=true, returns object containing success=true and operation = update', async () => {
      const result = await updateOrCreate(oneCourseInfo)
      expect(result).toEqual(expect.objectContaining({ success: true }))
      expect(result).toEqual(expect.objectContaining({ operation: 'update' }))
    })
  })
})
