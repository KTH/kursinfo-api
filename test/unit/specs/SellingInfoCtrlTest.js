/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict'
const proxyquire = require('proxyquire')
const expect = require('chai').expect
function MockSample (doc) {
  this.courseCode = doc.courseCode
  this.sellingTexts_en = doc.sellingTexts_en
}

MockSample.findById = function (courseCode) {
  let doc

  if (courseCode === '123') {
    doc = new MockSample({ courseCode: courseCode, sellingTexts_en: 'foo' })
  }

  if (courseCode === 'fail') {
    return Promise.reject(new Error('error'))
  }

  return Promise.resolve(doc)
}

MockSample.prototype.save = function () {
  if (this.courseCode === '123' || this.courseCode === 'abc') {
    return Promise.resolve()
  }

  return Promise.reject(new Error('error'))
}

const sample = proxyquire('../../../server/controllers/SellingInfoCtrl', {
  '../models': {
    courseModel: {
      CourseModel: MockSample
    }
  }
})

describe('Tests', function () {
  it('should getData ok', () => {
    const req = {
      params: {
        courseCode: '123'
      }
    }

    const res = {
      json: (obj) => {
        expect(obj.courseCode).to.equal('123')
      }
    }

    const next = (err) => {
      expect(err).to.be.undefined
    }

    sample.getData(req, res, next)
  })

  it('should handle getData not found', () => {
    const req = {
      params: {
        courseCode: 'abc'
      }
    }

    const res = {
      json: (data) => {
        expect(data).to.be.undefined
      }
    }

    const next = (err) => {
      expect(err).to.be.undefined
    }

    sample.getData(req, res, next)
  })

  it('should handle getData fail', () => {
    const req = {
      params: {
        courseCode: 'fail'
      }
    }

    const res = {
      json: (data) => {
        expect(data).to.be.undefined
      }
    }

    const next = (err) => {
      expect(err).to.be.not.undefined
    }

    sample.getData(req, res, next)
  })

  it('should postData update ok', () => {
    const req = {
      params: {
        courseCode: '123'
      },
      body: {
        sellingTexts_en: 'foo'
      }
    }

    const res = {
      json: (obj) => {
        expect(obj.courseCode).to.equal('123')
      }
    }

    const next = (err) => {
      expect(err).to.be.undefined
    }

    sample.postData(req, res, next)
  })

  it('should postData create ok', () => {
    const req = {
      params: {
        courseCode: 'abc'
      },
      body: {
        name: 'foo'
      }
    }

    const res = {
      json: (obj) => {
        expect(obj.courseCode).to.equal('abc')
      }
    }

    const next = (err) => {
      expect(err).to.be.undefined
    }

    sample.postData(req, res, next)
  })

  it('should handle postData fail', () => {
    const req = {
      params: {
        courseCode: 'fail'
      },
      body: {
        name: 'foo'
      }
    }

    const res = {
      json: (data) => {
        expect(data).to.be.undefined
      }
    }

    const next = (err) => {
      expect(err).to.be.not.undefined
    }

    sample.postData(req, res, next)
  })
})
