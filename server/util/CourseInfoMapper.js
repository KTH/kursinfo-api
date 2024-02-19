const toDBFormat = httpFormat => {
  const {
    sellingText: sellingTexts,
    sellingTextAuthor,
    imageInfo,
    supplementaryInfo: supplementaryInfos,
    courseDisposition: courseDispositions,
    courseCode,
  } = httpFormat

  const newFile = {
    courseCode: courseCode.toUpperCase(),
    imageInfo: imageInfo ?? undefined,
    sellingText_en: sellingTexts?.en ?? undefined,
    sellingText_sv: sellingTexts?.sv ?? undefined,
    sellingTextAuthor: sellingTextAuthor ?? undefined,
    supplementaryInfo_en: supplementaryInfos?.en ?? undefined,
    supplementaryInfo_sv: supplementaryInfos?.sv ?? undefined,
    courseDisposition_en: courseDispositions?.en ?? undefined,
    courseDisposition_sv: courseDispositions?.sv ?? undefined,
  }

  return newFile
}

const toClientFormat = dbFormat => {
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
  return formattedDoc
}

module.exports = {
  toDBFormat,
  toClientFormat,
}
