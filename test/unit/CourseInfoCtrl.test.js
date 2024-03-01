const { describe, expect, test } = require('@jest/globals')
const {
  getCourseInfoByCourseCode,
  postCourseInfo,
  patchCourseInfoByCourseCode,
} = require('../../server/controllers/CourseInfoCtrl')

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
const { getDoc, createDoc, updateDoc } = require('../../server/lib/DBWrapper')

jest.mock('../../server/util/CourseInfoMapper')
const CourseInfoMapper = require('../../server/util/CourseInfoMapper')

jest.mock('../../server/controllers/HttpError')
const { HttpError } = require('../../server/controllers/HttpError')
const { mockHttpError } = require('../../server/controllers/__mocks__/HttpError')

const mockDockDbFormat = {
  courseCode: 'SF1624',
  sellingText_en: 'fooEN',
  sellingText_sv: 'fooSV',
  courseDisposition_en: 'courseDisposition text en',
  courseDisposition_sv: 'courseDisposition text sv',
  supplementaryInfo_en: 'supplmentaryInfo text en',
  supplementaryInfo_sv: 'supplmentaryInfo text sv',
}
const mockDocFromDB = {
  ...mockDockDbFormat,
  save: jest.fn(),
}

const anotherMockDocFromDB = {
  courseCode: 'SF1624',
  sellingText_en: 'fooEN',
  sellingText_sv: 'fooSV',
  courseDisposition_en: 'other courseDisposition text en',
  courseDisposition_sv: 'other courseDisposition text sv',
  supplementaryInfo_en: 'other supplmentaryInfo text en',
  supplementaryInfo_sv: 'other supplmentaryInfo text sv',

  save: jest.fn(),
}

const mockDocClientFormat = {
  courseCode: 'SF1624',
  sellingText_en: 'fooEN',
  sellingText_sv: 'fooSV',
  sellingText: { en: 'fooEV', sv: 'fooSV' },
  courseDisposition: { en: 'courseDisposition text en', sv: 'courseDisposition text sv' },
  supplementaryInfo: { en: 'supplmentaryInfo text en', sv: 'supplmentaryInfo text sv' },
}

function buildRes(overrides = {}) {
  const res = {
    json: jest
      .fn(() => {
        return res
      })
      .mockName('json'),
    type: jest.fn(() => res).mockName('type'),
    send: jest.fn(() => 'sentSuccessful').mockName('send'),
    sendStatus: jest.fn(() => 'sendStatus').mockName('sendStatus'),
    status: jest.fn().mockReturnThis().mockName('status'),
    render: jest.fn(() => res).mockName('render'),

    ...overrides,
  }
  return res
}

const returnFromNext = 'returnedNext'
async function reqHandler(endpoint, req, overrides = {}) {
  const res = buildRes(overrides)
  const next = jest.fn(() => returnFromNext)

  const returnValue = await endpoint(req, res, next)
  return { returnValue, res, next }
}

//****************************************************************************************/
//                                                                                       *
//                      getCourseInfo                                                    *
//                                                                                       *
//****************************************************************************************/

describe('getCourseInfo', () => {
  beforeEach(() => {
    getDoc.mockResolvedValue(mockDocFromDB)
  })

  test('returns 400 if no courseCode is given', async () => {
    const { returnValue, next } = await reqHandler(getCourseInfoByCourseCode, { params: {} })

    expect(HttpError).toHaveBeenCalledWith(400, "Missing parameter 'courseCode'")
    expect(next).toHaveBeenCalledWith(mockHttpError)
    expect(returnValue).toStrictEqual(returnFromNext)
  })

  test(`returns 404 if courseCode does not exist`, async () => {
    getDoc.mockImplementationOnce(() => undefined)

    const { returnValue, next } = await reqHandler(getCourseInfoByCourseCode, { params: { courseCode: '11111' } })

    expect(HttpError).toHaveBeenCalledWith(404, `No entry found for courseCode: 11111`)
    expect(next).toHaveBeenCalledWith(mockHttpError)
    expect(returnValue).toStrictEqual(returnFromNext)
  })

  test('logs if courseCode doesnt exist', async () => {
    getDoc.mockResolvedValueOnce(undefined)

    await reqHandler(getCourseInfoByCourseCode, { params: { courseCode: '11111' } })

    expect(log.info).toHaveBeenNthCalledWith(1, 'No entry found for courseCode: 11111')
  })

  test('Returns error when database error occurs', async () => {
    const expectedError = new Error('Error from DB')
    getDoc.mockRejectedValueOnce(expectedError)

    const { returnValue, next } = await reqHandler(getCourseInfoByCourseCode, { params: { courseCode: 'sf1624' } })

    expect(log.error).toHaveBeenCalledWith('Failed fetching courseInfo', { err: expectedError })
    expect(next).toHaveBeenCalledWith(expectedError)
    expect(returnValue).toStrictEqual(returnFromNext)
  })

  test('logs sufficiently in happy case', async () => {
    await reqHandler(getCourseInfoByCourseCode, { params: { courseCode: mockDocFromDB.courseCode } })

    expect(log.info).toHaveBeenNthCalledWith(1, 'Successfully fetched CourseInfo for courseCode: ', 'SF1624')
  })

  test('calls toClientFormat with result from getDoc', async () => {
    await reqHandler(getCourseInfoByCourseCode, { params: { courseCode: mockDocFromDB.courseCode } })

    expect(CourseInfoMapper.toClientFormat).toHaveBeenCalledWith(mockDocFromDB)
  })

  test('returns CourseInfo Object when called', async () => {
    CourseInfoMapper.toClientFormat.mockReturnValueOnce(mockDocClientFormat)
    const { res, returnValue } = await reqHandler(getCourseInfoByCourseCode, {
      params: { courseCode: mockDocFromDB.courseCode },
    })

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith(mockDocClientFormat)
    expect(returnValue).toStrictEqual('sentSuccessful')
  })
})

//****************************************************************************************/
//                                                                                       *
//                      postCourseInfo                                                   *
//                                                                                       *
//****************************************************************************************/

describe('postCourseInfo', () => {
  beforeEach(() => {
    CourseInfoMapper.toDBFormat.mockReturnValue(mockDockDbFormat)
    getDoc.mockResolvedValue(undefined)
    CourseInfoMapper.toClientFormat.mockReturnValue(mockDocClientFormat)
  })

  test('returns status code 400 if no body present in request and returns result of res.send', async () => {
    const { returnValue, next } = await reqHandler(postCourseInfo, {})

    expect(HttpError).toHaveBeenCalledWith(400, 'Missing request body')
    expect(next).toHaveBeenCalledWith(mockHttpError)
    expect(returnValue).toStrictEqual(returnFromNext)
  })

  test('returns status code 400 if courseCode not present in request and returns result of res.send', async () => {
    const { returnValue, next } = await reqHandler(postCourseInfo, { body: {} })

    expect(HttpError).toHaveBeenCalledWith(400, "Missing parameter 'courseCode'")
    expect(next).toHaveBeenCalledWith(mockHttpError)
    expect(returnValue).toStrictEqual(returnFromNext)
  })

  test.each(['someCourseCode', 'someOtherCourseCode'])(
    'calls DBWrapper.getDoc with courseCode: %p',
    async courseCode => {
      await reqHandler(postCourseInfo, { body: { courseCode } })

      expect(getDoc).toHaveBeenCalledWith(courseCode)
    }
  )

  test.each(['someCourseCode', 'someOtherCourseCode'])(
    'returns status code 409 if courseInfo for courseCode "%p" already exists',
    async courseCode => {
      getDoc.mockResolvedValueOnce({ courseCode })

      const { returnValue, next } = await reqHandler(postCourseInfo, { body: { courseCode } })

      expect(HttpError).toHaveBeenCalledWith(
        409,
        `CourseInfo for courseCode '${courseCode}' already exists. Use PATCH instead.`
      )
      expect(next).toHaveBeenCalledWith(mockHttpError)
      expect(returnValue).toStrictEqual(returnFromNext)
    }
  )

  test.each(['someCourseCode', 'someOtherCourseCode'])('logs on error', async courseCode => {
    const errorMessage = 'Some error from DB'
    const error = new Error(errorMessage)

    getDoc.mockRejectedValueOnce(error)
    await reqHandler(postCourseInfo, { body: { courseCode } })

    expect(log.error).toHaveBeenCalledWith({ err: error, courseCode }, 'Error when contacting database')
  })

  test('returns caught error (passes it on to express)', async () => {
    const error = new Error('')
    getDoc.mockRejectedValueOnce(error)
    const { returnValue, next } = await reqHandler(postCourseInfo, { body: { courseCode: 'someCourseCode' } })

    expect(next).toHaveBeenCalledWith(error)
    expect(returnValue).toStrictEqual(returnFromNext)
  })

  describe('if at least courseCode is passed,', () => {
    test.each([
      {
        courseCode: 'someCourseCode',
        someParam: 'someParam',
        lastChangedBy: 'lastChangedBy',
      },
      {
        courseCode: 'someOtherCourseCode',
        lastChangedBy: 'lastChangedBy2',
      },
    ])('calls CourseInfoMapper.toDBFormat with request body', async body => {
      await reqHandler(postCourseInfo, { body })

      expect(CourseInfoMapper.toDBFormat).toHaveBeenCalledWith(body)
    })

    test.each([{ courseCode: 'someCourseCode' }, { courseCode: 'someCourseCode', lastChangedBy: 'someLastChangedBy' }])(
      'calls DBwrapper.createDoc with result from courseInfoMapper.toDBFormat',
      async dbFormat => {
        CourseInfoMapper.toDBFormat.mockReturnValueOnce(dbFormat)

        await reqHandler(postCourseInfo, { body: { courseCode: 'someCourseCode' } })

        expect(createDoc).toHaveBeenCalledWith(dbFormat)
      }
    )

    test.each([{ courseCode: 'someCourseCode' }, { courseCode: 'someCourseCode', lastChangedBy: 'someLastChangedBy' }])(
      'calls CourseInfoMapper.toClientFormat with result from courseInfoMapper.toDBFormat',
      async dbFormat => {
        createDoc.mockResolvedValueOnce(true)
        CourseInfoMapper.toDBFormat.mockReturnValueOnce(dbFormat)
        await reqHandler(postCourseInfo, { body: { courseCode: 'someCourseCode' } })
        expect(CourseInfoMapper.toClientFormat).toHaveBeenCalledWith(dbFormat)
      }
    )

    test.each([{ courseCode: 'someCourseCode' }, { courseCode: 'someCourseCode', lastChangedBy: 'someLastChangedBy' }])(
      'calls res.status/send with 201 and result from courseInfoMapper.toClientFormat',
      async httpFormat => {
        createDoc.mockResolvedValueOnce(true)
        CourseInfoMapper.toClientFormat.mockReturnValueOnce(httpFormat)

        const { res, returnValue } = await reqHandler(postCourseInfo, { body: { courseCode: 'someCourseCode' } })

        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.send).toHaveBeenCalledWith(httpFormat)
        expect(returnValue).toStrictEqual('sentSuccessful')
      }
    )

    test.each(['somecourseCode', 'someOtherCourseCode'])(
      'if createDoc rejects with error, calls log.error and breaks execution',
      async courseCode => {
        const errorMessage = 'Some error from DB'
        const error = new Error(errorMessage)
        createDoc.mockRejectedValueOnce(error)
        await reqHandler(postCourseInfo, { body: { courseCode } })
        expect(log.error).toHaveBeenCalledWith({ err: error, courseCode }, 'Error when contacting database')
        expect(CourseInfoMapper.toClientFormat).not.toHaveBeenCalled()
      }
    )
  })
})

//****************************************************************************************/
//                                                                                       *
//                      patchCourseInfoByCourseCode                                      *
//                                                                                       *
//****************************************************************************************/

const updatedFieldsDBFormat = {
  courseCode: 'SF1624',
  sellingText_en: 'fooEN',
  sellingText_sv: 'fooSV',
  courseDisposition_en: 'courseDisposition text en',
  courseDisposition_sv: 'courseDisposition text sv',
  supplementaryInfo_en: 'supplmentaryInfo text en',
  supplementaryInfo_sv: 'supplmentaryInfo text sv',
  imageInfo: 'updated image info',
}

const newFields = {
  imageInfo: 'updated image info',
  courseDisposition: { en: 'courseDisposition text en', sv: 'courseDisposition text sv' },
  supplementaryInfo: { en: 'supplmentaryInfo text en', sv: 'supplmentaryInfo text sv' },
}

const courseCode = 'SF1624'

const newFieldsError = new Error('Failed updating entry: ', newFields.courseCode)

describe('patchCourseInfoByCourseCode', () => {
  beforeEach(() => {
    getDoc.mockResolvedValue(mockDocFromDB)
    CourseInfoMapper.toDBFormat.mockReturnValue(updatedFieldsDBFormat)
    updateDoc.mockResolvedValue({ acknowledged: true })
    CourseInfoMapper.toClientFormat.mockReturnValue(mockDocClientFormat)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('returns status code 400 if courseCode not present in path and returns result of res.send', async () => {
    const { returnValue, next } = await reqHandler(patchCourseInfoByCourseCode, { params: {} })
    expect(HttpError).toHaveBeenCalledWith(400, "Missing path parameter 'courseCode'")
    expect(next).toHaveBeenCalledWith(mockHttpError)
    expect(returnValue).toStrictEqual(returnFromNext)
  })

  test('returns status code 400 if no body present in request and returns result of res.send', async () => {
    const { returnValue, next } = await reqHandler(patchCourseInfoByCourseCode, { params: { courseCode } })
    expect(HttpError).toHaveBeenCalledWith(400, 'Missing request body')
    expect(next).toHaveBeenCalledWith(mockHttpError)
    expect(returnValue).toStrictEqual(returnFromNext)
  })

  test('returns status code 400 if request body is empty and returns result of res.send', async () => {
    const { res, returnValue, next } = await reqHandler(patchCourseInfoByCourseCode, {
      params: { courseCode },
      body: {},
    })
    expect(HttpError).toHaveBeenCalledWith(400, 'Empty request body')
    expect(next).toHaveBeenCalledWith(mockHttpError)
    expect(returnValue).toStrictEqual(returnFromNext)
  })

  test.each(['someCourseCode', 'someOtherCourseCode'])(
    'calls DBWrapper.getDoc with courseCode: %p',
    async courseCode => {
      await reqHandler(patchCourseInfoByCourseCode, { params: { courseCode }, body: { imageInfo: 'someImageInfo' } })

      expect(getDoc).toHaveBeenCalledWith(courseCode)
    }
  )

  test.each(['someCourseCode', 'someOtherCourseCode'])(
    'returns status code 404 if courseInfo for courseCode "%p" does not exist',
    async courseCode => {
      getDoc.mockResolvedValueOnce(undefined)

      const { res, returnValue, next } = await reqHandler(patchCourseInfoByCourseCode, {
        params: { courseCode },
        body: { imageInfo: 'someImageInfo' },
      })

      expect(HttpError).toHaveBeenCalledWith(
        404,
        `CourseInfo for courseCode '${courseCode}' does not exist. Use POST instead.`
      )
      expect(next).toHaveBeenCalledWith(mockHttpError)
      expect(returnValue).toStrictEqual(returnFromNext)
    }
  )

  test.each(['someCourseCode', 'someOtherCourseCode'])(
    'if getDoc rejects, logs and returns error',
    async courseCode => {
      const errorMessage = 'Some error from DB'
      const error = new Error(errorMessage)

      getDoc.mockRejectedValueOnce(error)
      const { returnValue, next } = await reqHandler(patchCourseInfoByCourseCode, {
        params: { courseCode },
        body: { imageInfo: 'someImageInfo' },
      })
      expect(log.error).toHaveBeenCalledWith({ err: error, courseCode }, 'Error when contacting database')
      // expect(returnValue).toStrictEqual(error)
      expect(next).toHaveBeenCalledWith(error)
      expect(returnValue).toStrictEqual(returnFromNext)
    }
  )

  test('calls courseInfoMapper.toDBFormat with request body and isPatch: true', async () => {
    await reqHandler(patchCourseInfoByCourseCode, { params: { courseCode }, body: newFields })

    expect(CourseInfoMapper.toDBFormat).toHaveBeenCalledWith(newFields, true)
  })

  test('calls updateDoc with req.body content in dbFormat', async () => {
    await reqHandler(patchCourseInfoByCourseCode, { params: { courseCode }, body: newFields })
    expect(updateDoc).toHaveBeenCalledWith(courseCode, updatedFieldsDBFormat)
  })

  test.each([
    () => Promise.resolve({ acknowledged: false }),
    () => Promise.resolve({ acknowledged: undefined }),
    () => Promise.reject(new Error('')),
  ])('breaks execution if updateDoc rejects or if update.response.acknowledged is falsy', async promise => {
    updateDoc.mockImplementationOnce(promise)
    const { res } = await reqHandler(patchCourseInfoByCourseCode, { params: { courseCode }, body: newFields })
    expect(getDoc).toHaveBeenCalledTimes(1)
    expect(CourseInfoMapper.toClientFormat).toHaveBeenCalledTimes(0)
    expect(res.send).toHaveBeenCalledTimes(0)
  })

  test('breaks execution if update.response.acknowledged is false', async () => {
    updateDoc.mockResolvedValueOnce({ acknowledged: false })
    const { res } = await reqHandler(patchCourseInfoByCourseCode, { params: { courseCode }, body: newFields })
    expect(getDoc).toHaveBeenCalledTimes(1)
    expect(CourseInfoMapper.toClientFormat).toHaveBeenCalledTimes(0)
    expect(res.send).toHaveBeenCalledTimes(0)
  })

  test.each([() => Promise.resolve({ acknowledged: false }), () => Promise.reject(newFieldsError)])(
    'Error is logged and returned if updateDoc fails',
    async mockPromise => {
      updateDoc.mockImplementationOnce(mockPromise)
      const { returnValue, next } = await reqHandler(patchCourseInfoByCourseCode, {
        params: { courseCode },
        body: newFields,
      })
      expect(log.error).toHaveBeenCalledWith(
        {
          err: newFieldsError,
          courseCode,
        },
        'Error when contacting database'
      )
      expect(next).toHaveBeenCalledWith(newFieldsError)
      expect(returnValue).toStrictEqual(returnFromNext)
    }
  )

  test('runs getDoc twice to refetch updated entry', async () => {
    await reqHandler(patchCourseInfoByCourseCode, { params: { courseCode }, body: newFields })
    expect(getDoc).toHaveBeenCalledTimes(2)
    expect(getDoc).toHaveBeenNthCalledWith(1, 'SF1624')
    expect(getDoc).toHaveBeenLastCalledWith('SF1624')
  })

  test('runs toClientFormat with updatedDoc', async () => {
    getDoc.mockReturnValueOnce(mockDocFromDB)
    getDoc.mockReturnValueOnce(anotherMockDocFromDB)

    await reqHandler(patchCourseInfoByCourseCode, { params: { courseCode }, body: newFields })
    expect(CourseInfoMapper.toClientFormat).toBeCalledWith(anotherMockDocFromDB)
  })

  test('responds with 201 and updated doc in clientFormat', async () => {
    const { res } = await reqHandler(patchCourseInfoByCourseCode, { params: { courseCode }, body: newFields })
    expect(res.status).toBeCalledWith(201)
    expect(res.send).toHaveBeenCalledWith(mockDocClientFormat)
  })
})
