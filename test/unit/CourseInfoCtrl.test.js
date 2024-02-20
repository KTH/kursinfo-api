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

const mockDoc = {
  courseCode: 'SF1624',
  sellingText_en: 'fooEN',
  sellingText_sv: 'fooSV',
  courseDisposition_en: 'courseDisposition text en',
  courseDisposition_sv: 'courseDisposition text sv',
  supplementaryInfo_en: 'supplmentaryInfo text en',
  supplementaryInfo_sv: 'supplmentaryInfo text sv',

  save: jest.fn(),
}

const mockClientResponseDoc = {
  courseCode: 'SF1624',
  sellingText_en: 'fooEN',
  sellingText_sv: 'fooSV',
  sellingText: { en: 'fooEV', sv: 'fooSV' },
  courseDisposition: { en: 'courseDisposition text en', sv: 'courseDisposition text sv' },
  supplementaryInfo: { en: 'supplmentaryInfo text en', sv: 'supplmentaryInfo text sv' },
}

const newDoc = {
  sellingText: { en: 'New selling text', sv: 'Ny säljtext' },
  courseDisposition: { en: 'New course disposition text', sv: 'Ny kursuplägg text' },
  supplementaryInfo: { en: 'New supplementary info text', sv: 'Ny övrig info text' },
  sellingTextAuthor: 'Ada Lovelace',
  imageInfo: 'someImageInfo',
}

const updatedDoc = {
  courseCode: 'SF1624',
  sellingText_en: 'New selling text',
  sellingText_sv: 'Ny säljtext',
  sellingTextAuthor: 'Ada Lovelace',
  imageInfo: 'someImageInfo',
  courseDisposition_en: 'New course disposition text',
  courseDisposition_sv: 'Ny kursuplägg text',
  supplementaryInfo_en: 'New supplementary info text',
  supplementaryInfo_sv: 'Ny övrig info text',
  save: expect.any(Function),
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

async function reqHandler(endpoint, req, overrides = {}) {
  const res = buildRes(overrides)

  const returnValue = await endpoint(req, res)
  return { returnValue, res }
}

//****************************************************************************************/
//                                                                                       *
//                      getCourseInfo                                                    *
//                                                                                       *
//****************************************************************************************/

describe('getCourseInfo', () => {
  beforeEach(() => {
    getDoc.mockResolvedValue(mockDoc)
  })

  test('returns 400 if no courseCode is given', async () => {
    const { res, returnValue } = await reqHandler(getCourseInfoByCourseCode, { params: {} })

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toHaveBeenCalledWith("Missing parameter 'courseCode'")
    expect(returnValue).toStrictEqual('sentSuccessful')
  })

  test(`returns 404 if courseCode does not exist`, async () => {
    getDoc.mockImplementationOnce(() => undefined)

    const { res, returnValue } = await reqHandler(getCourseInfoByCourseCode, { params: { courseCode: '11111' } })

    expect(res.sendStatus).toHaveBeenCalledWith(404)
    expect(returnValue).toStrictEqual('sendStatus')
  })

  test('logs if courseCode doesnt exist', async () => {
    getDoc.mockResolvedValueOnce(undefined)

    await reqHandler(getCourseInfoByCourseCode, { params: { courseCode: '11111' } })

    expect(log.info).toHaveBeenNthCalledWith(1, 'No entry found for courseCode: 11111')
  })

  test('Returns error when database error occurs', async () => {
    const expectedError = new Error('Error from DB')
    getDoc.mockRejectedValueOnce(expectedError)

    const { returnValue } = await reqHandler(getCourseInfoByCourseCode, { params: { courseCode: 'sf1624' } })

    expect(log.error).toHaveBeenCalledWith('Failed fetching courseInfo', { err: expectedError })
    expect(returnValue).toEqual(expectedError)
  })

  test('logs sufficiently in happy case', async () => {
    await reqHandler(getCourseInfoByCourseCode, { params: { courseCode: mockDoc.courseCode } })

    expect(log.info).toHaveBeenNthCalledWith(1, 'Successfully fetched CourseInfo for courseCode: ', 'SF1624')
  })

  test('calls toClientFormat with result from getDoc', async () => {
    await reqHandler(getCourseInfoByCourseCode, { params: { courseCode: mockDoc.courseCode } })

    expect(CourseInfoMapper.toClientFormat).toHaveBeenCalledWith(mockDoc)
  })

  test('returns CourseInfo Object when called', async () => {
    CourseInfoMapper.toClientFormat.mockReturnValueOnce(mockClientResponseDoc)
    const { res, returnValue } = await reqHandler(getCourseInfoByCourseCode, {
      params: { courseCode: mockDoc.courseCode },
    })

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.send).toHaveBeenCalledWith(mockClientResponseDoc)
    expect(returnValue).toStrictEqual('sentSuccessful')
  })
})

//****************************************************************************************/
//                                                                                       *
//                      postCourseInfo                                                   *
//                                                                                       *
//****************************************************************************************/

describe('postCourseInfo', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  test('returns status code 400 if no body present in request and returns result of res.send', async () => {
    const { res, returnValue } = await reqHandler(postCourseInfo, {})

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toHaveBeenCalledWith('Missing request body')
    expect(returnValue).toStrictEqual('sentSuccessful')
  })

  test('returns status code 400 if courseCode not present in request and returns result of res.send', async () => {
    const { res, returnValue } = await reqHandler(postCourseInfo, { body: {} })

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toHaveBeenCalledWith("Missing parameter 'courseCode'")
    expect(returnValue).toStrictEqual('sentSuccessful')
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
      getDoc.mockResolvedValueOnce({ courseCode: courseCode })

      const { res, returnValue } = await reqHandler(postCourseInfo, { body: { courseCode } })

      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.send).toHaveBeenCalledWith(
        `CourseInfo for courseCode '${courseCode}' already exists. Use PATCH instead.`
      )
      expect(returnValue).toStrictEqual('sentSuccessful')
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
    const { returnValue } = await reqHandler(postCourseInfo, { body: { courseCode: 'someCourseCode' } })

    expect(returnValue).toStrictEqual(error)
  })

  describe('if at least courseCode is passed,', () => {
    test.each([
      {
        courseCode: 'someCourseCode',
        someParam: 'someParam',
        sellingTextAuthor: 'sellingTextAuthor',
      },
      {
        courseCode: 'someOtherCourseCode',
        sellingTextAuthor: 'sellingTextAuthor2',
      },
    ])('calls CourseInfoMapper.toDBFormat with request body', async body => {
      await reqHandler(postCourseInfo, { body })

      expect(CourseInfoMapper.toDBFormat).toHaveBeenCalledWith(body)
    })

    test.each([
      { courseCode: 'someCourseCode' },
      { courseCode: 'someCourseCode', sellingTextAuthor: 'someSellingTextAuthor' },
    ])('calls DBwrapper.createDoc with result from courseInfoMapper.toDBFormat', async dbFormat => {
      CourseInfoMapper.toDBFormat.mockReturnValueOnce(dbFormat)

      await reqHandler(postCourseInfo, { body: { courseCode: 'someCourseCode' } })

      expect(createDoc).toHaveBeenCalledWith(dbFormat)
    })

    test.each([
      { courseCode: 'someCourseCode' },
      { courseCode: 'someCourseCode', sellingTextAuthor: 'someSellingTextAuthor' },
    ])('calls CourseInfoMapper.toClientFormat with result from courseInfoMapper.toDBFormat', async dbFormat => {
      createDoc.mockResolvedValueOnce(true)
      CourseInfoMapper.toDBFormat.mockReturnValueOnce(dbFormat)
      await reqHandler(postCourseInfo, { body: { courseCode: 'someCourseCode' } })
      expect(CourseInfoMapper.toClientFormat).toHaveBeenCalledWith(dbFormat)
    })

    test.each([
      { courseCode: 'someCourseCode' },
      { courseCode: 'someCourseCode', sellingTextAuthor: 'someSellingTextAuthor' },
    ])('calls res.status/send with 201 and result from courseInfoMapper.toClientFormat', async httpFormat => {
      createDoc.mockResolvedValueOnce(true)
      CourseInfoMapper.toClientFormat.mockReturnValueOnce(httpFormat)

      const { res, returnValue } = await reqHandler(postCourseInfo, { body: { courseCode: 'someCourseCode' } })

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.send).toHaveBeenCalledWith(httpFormat)
      expect(returnValue).toStrictEqual('sentSuccessful')
    })

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

const updatedFields = {
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
  courseCode: 'SF1624',
  imageInfo: 'updated image info',
}

const newFieldsError = new Error('Failed updating entry: ', newFields.courseCode)

describe('patchCourseInfoByCourseCode', () => {
  beforeEach(() => {
    getDoc.mockResolvedValue(mockDoc)
    CourseInfoMapper.toDBFormat.mockReturnValue(updatedFields)
    updateDoc.mockResolvedValue({ acknowledged: true })
  })
  afterEach(() => {
    jest.resetAllMocks()
  })

  test('returns status code 400 if no body present in request and returns result of res.send', async () => {
    const { res, returnValue } = await reqHandler(patchCourseInfoByCourseCode, {})
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toHaveBeenCalledWith('Missing request body')
    expect(returnValue).toStrictEqual('sentSuccessful')
  })

  test('returns status code 400 if courseCode not present in request and returns result of res.send', async () => {
    const { res, returnValue } = await reqHandler(patchCourseInfoByCourseCode, { body: {} })
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.send).toHaveBeenCalledWith("Missing parameter 'courseCode'")
    expect(returnValue).toStrictEqual('sentSuccessful')
  })

  test.each(['someCourseCode', 'someOtherCourseCode'])(
    'calls DBWrapper.getDoc with courseCode: %p',
    async courseCode => {
      await reqHandler(patchCourseInfoByCourseCode, { body: { courseCode } })

      expect(getDoc).toHaveBeenCalledWith(courseCode)
    }
  )

  test.each(['someCourseCode', 'someOtherCourseCode'])(
    'returns status code 404 if courseInfo for courseCode "%p" does not exist',
    async courseCode => {
      getDoc.mockResolvedValueOnce(undefined)

      const { res, returnValue } = await reqHandler(patchCourseInfoByCourseCode, { body: { courseCode } })

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.send).toHaveBeenCalledWith(
        `CourseInfo for courseCode '${courseCode}' does not exist. Use POST instead.`
      )
      expect(returnValue).toStrictEqual('sentSuccessful')
    }
  )

  test.each(['someCourseCode', 'someOtherCourseCode'])(
    'if getDoc rejects, logs and returns error',
    async courseCode => {
      const errorMessage = 'Some error from DB'
      const error = new Error(errorMessage)

      getDoc.mockRejectedValueOnce(error)
      const { returnValue } = await reqHandler(patchCourseInfoByCourseCode, { body: { courseCode } })
      expect(log.error).toHaveBeenCalledWith({ err: error, courseCode }, 'Error when contacting database')
      expect(returnValue).toStrictEqual(error)
    }
  )

  test('calls courseInfoMapper.toDBFormat with request body', async () => {
    await reqHandler(patchCourseInfoByCourseCode, { body: mockDoc })

    expect(CourseInfoMapper.toDBFormat).toHaveBeenCalledWith(mockDoc)
  })

  test('calls updateDoc with req.body content in dbFormat', async () => {
    await reqHandler(patchCourseInfoByCourseCode, { body: newFields })
    expect(updateDoc).toHaveBeenCalledWith(newFields.courseCode, updatedFields)
  })

  test.each([() => Promise.resolve({ acknowledged: false }), () => Promise.reject(new Error(''))])(
    'breaks execution if updateDoc rejects or if update.response.acknowledged is falsy',
    async promise => {
      updateDoc.mockImplementationOnce(promise)
      const { res } = await reqHandler(patchCourseInfoByCourseCode, { body: newFields })
      expect(getDoc).toHaveBeenCalledTimes(1)
      expect(CourseInfoMapper.toClientFormat).toHaveBeenCalledTimes(0)
      expect(res.send).toHaveBeenCalledTimes(0)
    }
  )

  test('breaks execution if update.response.acknowledged is falsy', async () => {
    updateDoc.mockResolvedValueOnce({ acknowledged: false })
    const { res } = await reqHandler(patchCourseInfoByCourseCode, { body: newFields })
    expect(getDoc).toHaveBeenCalledTimes(1)
    expect(CourseInfoMapper.toClientFormat).toHaveBeenCalledTimes(0)
    expect(res.send).toHaveBeenCalledTimes(0)
  })

  test.each([() => Promise.resolve({ acknowledged: false }), () => Promise.reject(newFieldsError)])(
    'Error is logged and returned in rejected case',
    async mockPromise => {
      updateDoc.mockImplementationOnce(mockPromise)
      const { returnValue } = await reqHandler(patchCourseInfoByCourseCode, { body: newFields })
      expect(returnValue).toEqual(newFieldsError)
      expect(log.error).toHaveBeenCalledWith(
        {
          err: newFieldsError,
          courseCode: newFields.courseCode,
        },
        'Error when contacting database'
      )
    }
  )

  test('runs getDoc twice to refetch updated entry', async () => {
    await reqHandler(patchCourseInfoByCourseCode, { body: newFields })
    expect(getDoc).toHaveBeenCalledTimes(2)
    expect(getDoc).toHaveBeenNthCalledWith(1, 'SF1624')
    expect(getDoc).toHaveBeenLastCalledWith('SF1624')
  })

  test('runs toClientFormat with updatedDoc', async () => {
    getDoc.mockReturnValueOnce(mockDoc)
    getDoc.mockReturnValueOnce(updatedFields)

    await reqHandler(patchCourseInfoByCourseCode, { body: newFields })
    expect(CourseInfoMapper.toClientFormat).toBeCalledWith(updatedFields)
  })

  test('responds with 201 and updated doc in clientFormat', async () => {
    CourseInfoMapper.toClientFormat.mockReturnValue(updatedFields)
    const { res } = await reqHandler(patchCourseInfoByCourseCode, { body: newFields })
    expect(res.status).toBeCalledWith(201)
    expect(res.send).toHaveBeenCalledWith(updatedFields)
  })
})
