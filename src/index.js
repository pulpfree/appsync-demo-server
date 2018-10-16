import config from './config/config'

config.setDefaults()

exports.handler = async (event, context) => {
  console.log('config: ', config.getDefaults())
  // console.log("value1 = " + event.key1);
  // console.log("value2 = " + event.key2);
  // console.log("event: ", event); // eslint-disable-line
  // console.log("context: ", context); // eslint-disable-line
  // return "some success message";
  // or
  // return { body: 'some error type', statusCode: 501 }
  // body: JSON.stringify({ errorMessage: 'you messed up!' }),

  const response = {
    body: JSON.stringify(config),
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  /* const response = {
    body: JSON.stringify({ error: 'no good request' }),
    statusCode: 501,
    headers: {
      'Content-Type': 'application/json',
    },
  } */
  return response
}
