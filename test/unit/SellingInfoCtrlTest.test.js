function MockSample(doc) {
  this.courseCode = doc.courseCode
  this.sellingTexts_en = doc.sellingTexts_en
}
MockSample.findOne = function (courseCode) {
  let doc

  if (courseCode === 'SF1624') {
    doc = new MockSample({ courseCode, sellingTexts_en: 'foo', sellingText_sv: 'foo' })
  }

  if (courseCode === 'EF1111') {
    doc = new MockSample({})
  }

  if (courseCode === 'fail') {
    return Promise.reject(new Error('error'))
  }

  return Promise.resolve(doc)
}
MockSample.prototype.save = function () {
  if (this.courseCode === 'SF1624' || this.courseCode === 'EF1111') {
    return Promise.resolve()
  }

  return Promise.reject(new Error('error'))
}

jest.mock('../../server/models/courseModel', () => {
  return {
    CourseModel: MockSample,
  }
})
jest.mock('../../server/configuration', () => {
  return {
    server: {
      api_keys: '1234',
      apiKey: {},
      nodeApi: {},
      db: {},
      logging: {
        log: {
          level: 'debug',
        },
      },
      proxyPrefixPath: {
        uri: 'kursinfo',
      },
      collections: ['dev-tests'],
    },
  }
})

function buildReq(overrides) {
  const req = { headers: { accept: 'application/json' }, body: {}, params: {}, ...overrides }
  return req
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
    send: jest.fn(() => res).mockName('send'),
    render: jest.fn(() => res).mockName('render'),

    ...overrides,
  }
  return res
}

function buildNext(impl) {
  return jest.fn(impl).mockName('next')
}

jest.mock('kth-node-log', () => {
  return {
    init: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  }
})
describe('Test functions of SellingInfoCtrl.js', () => {
  beforeEach(() => {
    jest.resetModules()
    // process.env = { ...OLD_ENV }
    jest.clearAllMocks()
  })
  test('getData', async () => {
    const { getData } = require('../../server/controllers/SellingInfoCtrl')
    const req = buildReq({ params: { courseCode: 'sf1624' } })
    const res = buildRes()
    const response = await getData(req, res)
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  test('postData, update existing', async () => {
    const { postData } = require('../../server/controllers/SellingInfoCtrl')
    const req = buildReq({
      params: { courseCode: 'sf1624' },
      body: {
        sellingText: {
          sv: 'Kort beskrivning',
          en: 'Short description',
        },
        sellingTextAuthor: 'testuser',
        imageInfo: 'Picture_by_own_choice_SF1624.jpeg',
      },
    })
    const res = buildRes()
    const response = await postData(req, res)
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  test('postData, handle req if database give empty object (course is not yet in db)', async () => {
    const { postData } = require('../../server/controllers/SellingInfoCtrl')
    const req = buildReq({
      params: { courseCode: 'ef1111' },
      body: {
        sellingText: {
          sv: 'Kort beskrivning',
          en: 'Short description',
        },
        sellingTextAuthor: 'testuser',
        imageInfo: 'Picture_by_own_choice_EF1111.jpeg',
      },
    })
    const res = buildRes()
    const response = await postData(req, res)
    expect(res.json).toHaveBeenCalledTimes(1)
  })
})
