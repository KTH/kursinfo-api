const toDBFormat = httpFormat => {
  const {
    sellingText: sellingTexts,
    sellingTextAuthor,
    imageInfo,
    supplementaryInfo: supplementaryInfos,
    courseDisposition: courseDispositions,
  } = httpFormat
  return {
    imageInfo: imageInfo,
    sellingText_en: sellingTexts?.en,
    sellingText_sv: sellingTexts?.sv,
    sellingTextAuthor: sellingTextAuthor,
    supplementaryInfo_en: supplementaryInfos?.en,
    supplementaryInfo_sv: supplementaryInfos?.sv,
    courseDisposition_en: courseDispositions?.en,
    courseDisposition_sv: courseDispositions?.sv,
  }
}

const toHTTPFormat = dbFormat => {
  return {
    sellingText: {
      en: dbFormat.sellingText_en,
      sv: dbFormat.sellingText_sv,
    },
    supplementaryInfo: {
      en: dbFormat.supplementaryInfo_en,
      sv: dbFormat.supplementaryInfo_sv,
    },
    courseDisposition: {
      en: dbFormat.courseDisposition_en,
      sv: dbFormat.courseDisposition_sv,
    },
    sellingTextAuthor: sellingTextAuthor,
    imageInfo: dbFormat.imageInfo,
  }
}

module.exports = {
  toDBFormat,
  toHTTPFormat,
}
