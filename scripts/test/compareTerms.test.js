const { compareTerms, sortCourseInfos } = require('../utils/compareTerms')

describe('compareTerms', () => {
  test.each(['20202', '20203', '19983', '19532'])('if same termString (%d), should return 0', term => {
    expect(compareTerms(term, term)).toBe(0)
  })

  test.each([
    ['20202', '20201'],
    ['20213', '20211'],
    ['20215', '20214'],
  ])('if same year, if first term (%d) is after second (%d), should return negative', (term1, term2) => {
    expect(compareTerms(term1, term2)).toBeLessThan(0)
  })

  test.each([
    ['20201', '20202'],
    ['20211', '20213'],
    ['20214', '20215'],
  ])('if same year, if first term (%d) is before second (%d), should return positive', (term1, term2) => {
    expect(compareTerms(term1, term2)).toBeGreaterThan(0)
  })

  test.each([
    ['20201', '20191'],
    ['20201', '20192'],
    ['20211', '19993'],
    ['20242', '20215'],
  ])('if different year, if first year (%d) is after second (%d), should return negative', (term1, term2) => {
    expect(compareTerms(term1, term2)).toBeLessThan(0)
  })

  test.each([
    ['20201', '20191'],
    ['20201', '20192'],
    ['20211', '19993'],
    ['20242', '20215'],
  ])('if different year, if first year (%d) is before second (%d), should return positive', (term1, term2) => {
    expect(compareTerms(term2, term1)).toBeGreaterThan(0)
  })
})

describe('sortCourseInfos', () => {
  const unsorted = [
    { validToTerm: '19941' },
    { validToTerm: '20002' },
    { validToTerm: '20191' },
    { validToTerm: '20201' },
  ]

  test('sorts courseInfos by validToTerm', () => {
    const sorted = sortCourseInfos(unsorted)

    expect(sorted).toStrictEqual([
      { validToTerm: '20201' },
      { validToTerm: '20191' },
      { validToTerm: '20002' },
      { validToTerm: '19941' },
    ])
  })
})
