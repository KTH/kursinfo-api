const log = require('@kth/log')
const nodeMongo = require('@kth/mongo')

const mongoOptions = {
  ssl: process.env.MONGODB_SSL,
  dbUri: process.env.MONGODB_URI,
  logger: log,
}

module.exports.connect = function connect() {
  nodeMongo
    .connect(mongoOptions)
    .then(data => {
      log.info({ data }, 'MongoDB: connected')
    })
    .catch(err => {
      log.error({ err }, 'MongoDB: ERROR connecting DB')
    })
}
