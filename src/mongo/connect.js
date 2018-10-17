import mongoose from 'mongoose'

const db = {
  cfg: {},
  uri: '',
}

db.connect = async function connect(cfg) {
  this.cfg = cfg
  this.setUri()
  mongoose.connect(this.uri, { useNewUrlParser: true })

  // see: https://medium.com/@vsvaibhav2016/best-practice-of-mongoose-connection-with-mongodb-c470608483f0
  // for info on best practices
  const dbConn = mongoose.connection

  dbConn.on('error', (e) => {
    console.error('Mongoose connection error: ', e) // eslint-disable-line
  })
  dbConn.once('open', () => {
    console.log('Mongoose open to ', this.uri) // eslint-disable-line
  })
  dbConn.on('disconnected', () => {
    console.log('Mongoose disconnected') // eslint-disable-line
  })
  process.on('SIGINT', () => {
    dbConn.close(() => {
      console.log('Mongoose disconnected due to application termination') // eslint-disable-line
      process.exit(0)
    })
  })

  return dbConn
}

db.setUri = function setUri() {
  if (!this.cfg.mongoDBName || !this.cfg.mongoDBPort) {
    throw new Error('Missing mongoDBName')
  }

  if (this.cfg.nodeEnv === 'prod') {
    // we can expect that username and password are set in config
    if (!this.cfg.mongoDBUsername || !this.cfg.mongoDBPassword) {
      throw new Error('Missing mongoDBUsername or mongoDBPassword in config')
    }
    this.uri = `mongodb://${this.cfg.mongoDBUsername}:${this.cfg.mongoDBPassword}@${this.cfg.mongoDBHost}/${this.cfg.mongoDBName}?replicaSet=${this.cfg.mongoDBReplset}&authSource=admin`
  } else {
    this.uri = `mongodb://${this.cfg.mongoDBHost}/${this.cfg.mongoDBName}`
  }
}

module.exports = db
