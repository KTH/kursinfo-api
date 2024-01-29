const { describe, expect, test } = require('@jest/globals')

jest.mock('@kth/log', () => {
  return {
    init: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  }
})
const log = require('@kth/log')

jest.mock('../../server/lib/DBWrapper')
const { getExistingDocOrNewOne } = require('../../server/lib/DBWrapper')

const mockDoc = {
  courseCode: 'SF1624',
  sellingText_en: 'fooEN',
  sellingText_sv: 'fooSV',
  save: jest.fn(),
}

const newDoc = {
  sellingText: { en: 'New selling text', sv: 'Ny säljtext' },
  sellingTextAuthor: 'Ada Lovelace',
  imageInfo: 'someImageInfo',
}

function buildRes(overrides = {}) {
  const res = {
    json: jest
      .fn(() => {
        return res
      })
      .mockName('json'),
    status: jest.fn(() => res).mockName('status'),
    type: jest.fn(() => res).mockName('type'),
    send: jest.fn(() => 'sentSuccessful').mockName('send'),
    render: jest.fn(() => res).mockName('render'),

    ...overrides,
  }
  return res
}

describe('putCourseInfo', () => {
  beforeEach(() => {
    getExistingDocOrNewOne.mockImplementation(() => {
      return mockDoc
    })
  })
  const { putCourseInfoByCourseCode } = require('../../server/controllers/CourseInfoCtrl')

  test('returns 400 if no courseCode is given', () => {
    const req = { params: {} }
    const res = buildRes()
    putCourseInfoByCourseCode(req, res)

    expect(res.send).toHaveBeenCalledWith(400, "Missing parameter 'courseCode'")
  })

  test('returns 400 if no body is given', () => {
    const req = { params: { courseCode: 'sf1624' }, body: {} }
    const res = buildRes()
    putCourseInfoByCourseCode(req, res)
    expect(res.send).toHaveBeenCalledWith(400, 'Missing request body')
  })

  test('calls getExistingDocOrNewOne with courseCode', () => {
    const req = { params: { courseCode: 'sf1624' }, body: newDoc }
    const res = buildRes()
    putCourseInfoByCourseCode(req, res)

    expect(getExistingDocOrNewOne).toHaveBeenCalledWith('sf1624')
  })
  test('if no matching object exists in DB, writes a new object to the DB', async () => {
    const emptyMockDoc = {
      courseCode: 'SF1624',
      save: jest.fn(),
    }
    getExistingDocOrNewOne.mockImplementationOnce(() => emptyMockDoc)

    const courseCode = 'SF1624'

    const req = { params: { courseCode }, body: newDoc }
    const res = buildRes()
    await putCourseInfoByCourseCode(req, res)

    expect(emptyMockDoc).toStrictEqual({
      courseCode: 'SF1624',
      sellingText_en: 'New selling text',
      sellingText_sv: 'Ny säljtext',
      sellingTextAuthor: 'Ada Lovelace',
      imageInfo: 'someImageInfo',
      save: expect.any(Function),
    })

    const { save: _, ...expectedResponse } = emptyMockDoc
    expect(res.send).toHaveBeenCalledWith(201, expectedResponse)
  })

  test('if matching object exists in DB, writes object with new data to the DB', async () => {
    const req = { params: { courseCode: 'sf1624' }, body: newDoc }
    const res = buildRes()
    const returnValue = await putCourseInfoByCourseCode(req, res)

    expect(mockDoc).toStrictEqual({
      courseCode: 'SF1624',
      sellingText_en: 'New selling text',
      sellingText_sv: 'Ny säljtext',
      sellingTextAuthor: 'Ada Lovelace',
      imageInfo: 'someImageInfo',
      save: expect.any(Function),
    })
    expect(mockDoc.save).toHaveBeenCalled()

    const { save: _, ...expectedResponse } = mockDoc
    expect(res.send).toHaveBeenCalledWith(201, expectedResponse)

    expect(returnValue).toStrictEqual('sentSuccessful')
  })

  test('if error occurs, return error', async () => {
    const expectedError = new Error('Error from DB')
    getExistingDocOrNewOne.mockImplementationOnce(() => {
      throw expectedError
    })

    const req = { params: { courseCode: 'sf1624' }, body: newDoc }
    const res = buildRes()
    const returnValue = await putCourseInfoByCourseCode(req, res)

    expect(log.error).toHaveBeenCalledWith('Failed posting courseInfo', { err: expectedError })

    expect(returnValue).toEqual(expectedError)
  })

  test('additional fields are not written to db', async () => {
    const newDocExtraFields = {
      ...newDoc,
      foo: 'bar',
      test: 'fields',
    }

    const req = { params: { courseCode: 'sf1624' }, body: newDocExtraFields }
    const res = buildRes()
    await putCourseInfoByCourseCode(req, res)

    expect(mockDoc).toStrictEqual({
      courseCode: 'SF1624',
      sellingText_en: 'New selling text',
      sellingText_sv: 'Ny säljtext',
      sellingTextAuthor: 'Ada Lovelace',
      imageInfo: 'someImageInfo',
      save: expect.any(Function),
    })
  })

  test('does not set parameters that were not sent', async () => {
    const emptyMockDoc = {
      courseCode: 'SF1624',
      save: jest.fn(),
    }
    getExistingDocOrNewOne.mockImplementationOnce(() => emptyMockDoc)
    const req = { params: { courseCode: 'sf1624' }, body: {} }
    const res = buildRes()
    const result = await putCourseInfoByCourseCode(req, res)

    expect(emptyMockDoc).toStrictEqual({
      courseCode: 'SF1624',
      save: expect.any(Function),
    })
  })

  test('logs sufficiently in happy case', async () => {
    const req = { params: { courseCode: 'sf1624' }, body: newDoc }
    const res = buildRes()
    await putCourseInfoByCourseCode(req, res)

    expect(log.info).toHaveBeenNthCalledWith(1, 'Saving for a course: ', 'SF1624', 'Data: ', newDoc)
    const { save: _, ...expectedResponse } = mockDoc
    expect(log.info).toHaveBeenNthCalledWith(
      2,
      'Successfully saved for courseCode: ',
      'SF1624',
      'Data: ',
      expectedResponse
    )
  })
})
