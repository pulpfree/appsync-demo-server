// import mongoose from 'mongoose'

import config from './config/config'
import mongoose from './mongo/connect'

let db

// exports.handler = (event, context, callback) => { // eslint-disable-line
exports.handler = async (event) => {
  if (!db) {
    const cfg = await config.load()
    db = await mongoose.connect(cfg)
  }

  console.log("Received event - arguments:", JSON.stringify(event, 3)); // eslint-disable-line
  // console.log("Context", JSON.stringify(context, 3)); // eslint-disable-line
  /*
  const response = {
    body: JSON.stringify({ error: 'no good request' }),
    statusCode: 501,
    headers: {
      'Content-Type': 'application/json',
    },
  }
  return response
  */
  return { id: "abc123" }; // eslint-disable-line
  // callback(null, { "id": "456123" })
}
