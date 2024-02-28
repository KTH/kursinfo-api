const { describe, expect, test } = require('@jest/globals')
const { toDBFormat, toClientFormat } = require('../../server/util/CourseInfoMapper')

const dbFormatDoc = {
  courseCode: 'SF1624',
  sellingText_en: 'fooEN',
  sellingText_sv: 'fooSV',
  courseDisposition_en: 'courseDisposition text en',
  courseDisposition_sv: 'courseDisposition text sv',
  supplementaryInfo_en: 'supplmentaryInfo text en',
  supplementaryInfo_sv: 'supplmentaryInfo text sv',
  sellingTextAuthor: 'Ada Lovelace',
  imageInfo: 'someImageInfo',
}

const clientFormatDoc = {
  courseCode: 'SF1624',
  sellingText: { en: 'fooEN', sv: 'fooSV' },
  courseDisposition: { en: 'courseDisposition text en', sv: 'courseDisposition text sv' },
  supplementaryInfo: { en: 'supplmentaryInfo text en', sv: 'supplmentaryInfo text sv' },
  sellingTextAuthor: 'Ada Lovelace',
  imageInfo: 'someImageInfo',
}

const clientFormatExtraFieldsDoc = {
  courseCode: 'SF1624',
  sellingText: { en: 'fooEN', sv: 'fooSV' },
  courseDisposition: { en: 'courseDisposition text en', sv: 'courseDisposition text sv' },
  supplementaryInfo: { en: 'supplmentaryInfo text en', sv: 'supplmentaryInfo text sv' },
  sellingTextAuthor: 'Ada Lovelace',
  imageInfo: 'someImageInfo',
  extraField: 'extra field info',
}

const clientFormatNullFieldsDoc = {
  courseCode: 'SF1624',
  sellingText: { en: 'fooEN', sv: 'fooSV' },
  courseDisposition: { en: 'courseDisposition text en', sv: 'courseDisposition text sv' },
  supplementaryInfo: { en: null, sv: null },
  sellingTextAuthor: 'Ada Lovelace',
  imageInfo: 'someImageInfo',
}

const clientFormatMissingFieldsDoc = {
  courseCode: 'SF1624',
  sellingText: { en: 'fooEN', sv: 'fooSV' },
  courseDisposition: { en: 'courseDisposition text en', sv: 'courseDisposition text sv' },
  sellingTextAuthor: 'Ada Lovelace',
  imageInfo: 'someImageInfo',
  extraField: 'extra field info',
}
const dbFormatEmptyFields = {
  courseCode: 'SF1624',
  sellingText_en: 'fooEN',
  sellingText_sv: 'fooSV',
  courseDisposition_en: 'courseDisposition text en',
  courseDisposition_sv: 'courseDisposition text sv',
  supplementaryInfo_en: undefined,
  supplementaryInfo_sv: undefined,
  sellingTextAuthor: 'Ada Lovelace',
  imageInfo: 'someImageInfo',
}

const dbFormatExtraFieldsDoc = {
  courseCode: 'SF1624',
  sellingText_en: 'fooEN',
  sellingText_sv: 'fooSV',
  courseDisposition_en: 'courseDisposition text en',
  courseDisposition_sv: 'courseDisposition text sv',
  supplementaryInfo_en: 'supplmentaryInfo text en',
  supplementaryInfo_sv: 'supplmentaryInfo text sv',
  sellingTextAuthor: 'Ada Lovelace',
  imageInfo: 'someImageInfo',
  extraField: 'extraInfo',
}

const dbFormatMissingFields = {
  courseCode: 'SF1624',
  sellingText_en: 'fooEN',
  sellingText_sv: 'fooSV',
  courseDisposition_en: 'courseDisposition text en',
  courseDisposition_sv: 'courseDisposition text sv',
  sellingTextAuthor: 'Ada Lovelace',
  imageInfo: 'someImageInfo',
}

const clientFormatEmptyFieldsDoc = {
  courseCode: 'SF1624',
  sellingText: { en: 'fooEN', sv: 'fooSV' },
  courseDisposition: { en: 'courseDisposition text en', sv: 'courseDisposition text sv' },
  supplementaryInfo: { en: '', sv: '' },
  sellingTextAuthor: 'Ada Lovelace',
  imageInfo: 'someImageInfo',
}

const correctClientFormatPatch = {
  sellingText: { en: 'fooEN', sv: 'fooSV' },
  courseDisposition: { en: 'courseDisposition text en', sv: 'courseDisposition text sv' },
  supplementaryInfo: { en: 'some Supplementary info', sv: 'övrig information' },
  sellingTextAuthor: 'Ada Lovelace',
  imageInfo: 'someImageInfo',
}

const expectedDBFormatPatch = {
  sellingText_en: 'fooEN',
  sellingText_sv: 'fooSV',
  courseDisposition_en: 'courseDisposition text en',
  courseDisposition_sv: 'courseDisposition text sv',
  supplementaryInfo_en: 'some Supplementary info',
  supplementaryInfo_sv: 'övrig information',
  sellingTextAuthor: 'Ada Lovelace',
  imageInfo: 'someImageInfo',
}

describe('toDBFormat', () => {
  test('returns correct format with appropriate input', () => {
    const formattedDoc = toDBFormat(clientFormatDoc)

    expect(formattedDoc).toStrictEqual(dbFormatDoc)
  })
  test('input with extra fields are not added to output', () => {
    const formattedDoc = toDBFormat(clientFormatExtraFieldsDoc)
    expect(formattedDoc).toStrictEqual(dbFormatDoc)
  })
  test('empty fields are empty strings in DB format', () => {
    const formattedDoc = toDBFormat(clientFormatMissingFieldsDoc)
    expect(formattedDoc).toStrictEqual(dbFormatEmptyFields)
  })
  test('null fields are empty strings', () => {
    const formattedDoc = toDBFormat(clientFormatNullFieldsDoc)
    expect(formattedDoc).toStrictEqual(dbFormatEmptyFields)
  })

  test.each([correctClientFormatPatch, { ...correctClientFormatPatch, courseCode: 'someCourseCode' }])(
    `if boolean 'isPatch' is true, removes courseCode if it exists`,
    patchObject => {
      const formattedDoc = toDBFormat(patchObject, true)
      expect(formattedDoc).toStrictEqual(expectedDBFormatPatch)
    }
  )
})

describe('toClientFormat', () => {
  test('returns correct format with appropriate input', () => {
    const formattedDoc = toClientFormat(dbFormatDoc)
    expect(formattedDoc).toStrictEqual(clientFormatDoc)
  })
  test('input with extra fields are not added to output', () => {
    const formattedDoc = toClientFormat(dbFormatExtraFieldsDoc)
    expect(formattedDoc).toStrictEqual(clientFormatDoc)
  })
  test('input with missing fields are empty strings', () => {
    const formattedDoc = toClientFormat(dbFormatMissingFields)
    expect(formattedDoc).toStrictEqual(clientFormatEmptyFieldsDoc)
  })
})
