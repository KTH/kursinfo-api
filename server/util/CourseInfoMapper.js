const toDBFormat = (httpFormat, isPatch = false) => {
  const {
    sellingText: sellingTexts,
    lastChangedBy,
    imageInfo,
    supplementaryInfo: supplementaryInfos,
    courseDisposition: courseDispositions,
    recommendedPrerequisites: recommendedPrerequisites,
    courseCode,
  } = httpFormat

  const newFile = {
    courseCode: courseCode ? courseCode.toUpperCase() : undefined,
    imageInfo: imageInfo ?? undefined,
    sellingText_en: sellingTexts?.en ?? undefined,
    sellingText_sv: sellingTexts?.sv ?? undefined,
    sellingTextAuthor: lastChangedBy ?? undefined,
    supplementaryInfo_en: supplementaryInfos?.en ?? undefined,
    supplementaryInfo_sv: supplementaryInfos?.sv ?? undefined,
    courseDisposition_en: courseDispositions?.en ?? undefined,
    courseDisposition_sv: courseDispositions?.sv ?? undefined,
    recommendedPrerequisites_en: recommendedPrerequisites?.en ?? undefined,
    recommendedPrerequisites_sv: recommendedPrerequisites?.sv ?? undefined,
  }

  if (isPatch) {
    delete newFile.courseCode
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
    recommendedPrerequisites: {
      en: dbFormat.recommendedPrerequisites_en ?? '',
      sv: dbFormat.recommendedPrerequisites_sv ?? '',
    },
    lastChangedBy: dbFormat.sellingTextAuthor ?? '',
    imageInfo: dbFormat.imageInfo ?? '',
  }
  return formattedDoc
}

module.exports = {
  toDBFormat,
  toClientFormat,
}
