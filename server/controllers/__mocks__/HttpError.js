const mockHttpError = {
  message: 'Mocked HttpError',
  isHttpError: true,
}

const HttpError = jest.fn(() => mockHttpError)

module.exports = {
  HttpError,
  mockHttpError,
}
