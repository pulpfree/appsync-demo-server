// import mongoose from 'mongoose'

import config from './config/config'
import mongoose from './mongo/connect'

let db

// exports.handler = (event, context, callback) => { // eslint-disable-line
exports.handler = async (event) => {
  if (!db) {
    console.log('connecting to mongoose') // eslint-disable-line
    const cfg = await config.load()
    db = await mongoose.connect(cfg)
  }

  console.log("Received event {}", JSON.stringify(event, 3)) // eslint-disable-line

  /* const response = {
    body: JSON.stringify({ error: 'no good request' }),
    statusCode: 501,
    headers: {
      'Content-Type': 'application/json',
    },
  } */
  return { "id": "abc123" } // eslint-disable-line
  // callback(null, { "id": "456123" })
}
