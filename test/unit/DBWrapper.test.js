class MockCourseModel {
  constructor({ courseCode, sellingTexts_en, sellingTexts_sv }) {
    this.courseCode = courseCode
    this.sellingTexts_en = sellingTexts_en
    this.sellingTexts_sv = sellingTexts_sv
  }
}

const createMockFindOne = courseCodeOrCommand => () => {
  let doc

  switch (courseCodeOrCommand) {
    case 'none':
      doc = undefined
      break
    case 'fail':
      return Promise.reject(new Error('Error from DB'))
    default:
      doc = new MockCourseModel({ courseCode: courseCodeOrCommand, sellingTexts_en: 'fooEN', sellingTexts_sv: 'fooSV' })
      break
  }
  return Promise.resolve(doc)
}
// test('calls CourseModel.findOne with courseCode', () => {
//   const req = { params: { courseCode: 'SF1624' } }
//   const res = buildRes()
//   putCourseInfo(req, res)

//   expect(CourseModel.findOne).toHaveBeenCalledWith({ courseCode: 'SF1624' })
// })

// test('calls CourseModel.findOne with uppercase CourseCode', () => {
//   const req = { params: { courseCode: 'sf1624' } }
//   const res = buildRes()
//   const test = putCourseInfo(req, res)

//   expect(CourseModel.findOne).toHaveBeenCalledWith({ courseCode: 'SF1624' })
// })
