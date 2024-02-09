// TEST that extra fields arent added
// TEST that empty fields are null in DB??

const toDBFormat = httpFormat => {
  const {
    sellingText: sellingTexts,
    sellingTextAuthor,
    imageInfo,
    supplementaryInfo: supplementaryInfos,
    courseDisposition: courseDispositions,
    courseCode,
  } = httpFormat
  return {
    courseCode: courseCode.toUpperCase(),
    imageInfo: imageInfo,
    sellingText_en: sellingTexts.en ?? '',
    sellingText_sv: sellingTexts.sv ?? '',
    sellingTextAuthor: sellingTextAuthor ?? '',
    supplementaryInfo_en: supplementaryInfos?.en ?? '',
    supplementaryInfo_sv: supplementaryInfos?.sv ?? '',
    courseDisposition_en: courseDispositions?.en ?? '',
    courseDisposition_sv: courseDispositions?.sv ?? '',
  }
}

const toClientFormat = dbFormat => {
  console.log(dbFormat, 'in client format')

  const formattedDoc = {
    courseCode: dbFormat.courseCode,
    sellingText: {
      en: dbFormat.sellingText_en ?? '',
      sv: dbFormat.sellingText_sv ?? '',
    },
    supplementaryInfo: {
      en: dbFormat.supplementaryInfo_en ?? '',
      sv: dbFormat.supplementaryInfo_sv ?? '',
    },
    courseDisposition: {
      en: dbFormat.courseDisposition_en ?? '',
      sv: dbFormat.courseDisposition_sv ?? '',
    },
    sellingTextAuthor: dbFormat.sellingTextAuthor ?? '',
    imageInfo: dbFormat.imageInfo ?? '',
  }
  console.log(formattedDoc, 'formatted doc')
  return formattedDoc
}

module.exports = {
  toDBFormat,
  toClientFormat,
}
