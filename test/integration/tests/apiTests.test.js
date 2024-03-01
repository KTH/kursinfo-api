const { INTEGRATION_TEST_BASEURL: BASE_URL, API_KEY } = process.env

console.log('--------------------------------------------------------------------')
console.log(`Starting test run with BASE_URL: ${BASE_URL} and API_KEY: ${API_KEY}`)
console.log('--------------------------------------------------------------------')

const headers = {
  api_key: API_KEY,
}

const courseCode = 'SF4242'

const getCheckApiKey = async () => {
  const result = await fetch(`${BASE_URL}/_checkApikey`, {
    method: 'GET',
    headers,
  })

  const { status } = result

  return { status }
}

const getCourseInfo = async courseCode => {
  const result = await fetch(`${BASE_URL}/v1/courseInfo/${courseCode}`, {
    method: 'GET',
    headers,
  })

  const body = await result.json()

  const { status } = result

  return { status, body }
}

const patchCourseInfo = async (courseCode, patchObject) => {
  const result = await fetch(`${BASE_URL}/v1/courseInfo/${courseCode}`, {
    method: 'PATCH',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patchObject),
  })

  const body = await result.json()

  const { status } = result

  return { status, body }
}

const postCourseInfo = async postObject => {
  const newLocal = `${BASE_URL}/v1/courseInfo/`
  const result = await fetch(newLocal, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postObject),
  })

  const body = await result.json()

  const { status } = result

  return { status, body }
}

const expected = {
  courseCode: courseCode,
  sellingText: {
    en: '',
    sv: '',
  },
  supplementaryInfo: {
    en: '',
    sv: '',
  },
  courseDisposition: {
    en: '',
    sv: '',
  },
  lastChangedBy: '',
  imageInfo: 'someImageInfo',
}

const expectedPatch = {
  ...expected,
  imageInfo: 'someOtherImageInfo',
  supplementaryInfo: {
    en: 'Supplementary info in english',
    sv: 'Övrig information på svenska',
  },
}

describe('kursinfo-api', () => {
  test('_checkApiKey should return 200 OK', async () => {
    const { status } = await getCheckApiKey()

    expect(status).toStrictEqual(200)
  })

  test('getCourseInfo with courseCode without entry should return 404 and message', async () => {
    const { status, body } = await getCourseInfo(courseCode)

    const { message } = body

    expect(status).toStrictEqual(404)
    expect(message).toStrictEqual(`No entry found for courseCode: ${courseCode}`)
  })

  test('patchCourseInfo with courseCode without entry should return 404 and message', async () => {
    const { status, body } = await patchCourseInfo(courseCode, { imageInfo: 'Foo' })
    const { message } = body

    expect(status).toStrictEqual(404)
    expect(message).toStrictEqual(`CourseInfo for courseCode '${courseCode}' does not exist. Use POST instead.`)
  })

  test('postCourseInfo with non-existent courseCode should return 201 and object', async () => {
    const { status, body } = await postCourseInfo({ courseCode: courseCode, imageInfo: 'someImageInfo' })

    expect(status).toStrictEqual(201)

    expect(body).toEqual(expected)
  })

  test('postCourseInfo with courseCode WITH entry should return 409 and message', async () => {
    const { status, body } = await postCourseInfo({ courseCode: courseCode, imageInfo: 'someImageInfo' })
    const { message } = body

    expect(status).toStrictEqual(409)
    expect(message).toStrictEqual(`CourseInfo for courseCode '${courseCode}' already exists. Use PATCH instead.`)
  })

  test('patchCourseInfo alters entry in database and returns 201 and altered object', async () => {
    const { status, body } = await patchCourseInfo(courseCode, {
      imageInfo: 'someOtherImageInfo',
      supplementaryInfo: {
        en: 'Supplementary info in english',
        sv: 'Övrig information på svenska',
      },
    })

    expect(status).toStrictEqual(201)
    expect(body).toEqual(expectedPatch)
  })

  test('getCourseInfo returns entry corresponding to courseCode', async () => {
    const { body } = await getCourseInfo(courseCode)

    expect(body).toEqual(expectedPatch)
  })
})
