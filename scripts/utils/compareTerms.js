const compareTerms = (term1, term2) => {
  const [year1, termIndex1] = extractParts(term1)
  const [year2, termIndex2] = extractParts(term2)

  if (year1 === year2) {
    return termIndex2 - termIndex1
  }

  return year2 - year1
}

const extractParts = term1 => {
  const year = parseInt(term1.slice(0, 4))
  const termIndex = parseInt(term1.slice(4, 5))

  return [year, termIndex]
}

const sortCourseInfos = courseInfos => {
  return courseInfos.sort(({ validToTerm: validToTerm1 }, { validToTerm: validToTerm2 }) =>
    compareTerms(validToTerm1, validToTerm2)
  )
}

module.exports = {
  compareTerms,
  sortCourseInfos,
}
