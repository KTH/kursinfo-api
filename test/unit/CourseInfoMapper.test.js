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
  supplementaryInfo_en: '',
  supplementaryInfo_sv: '',
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
