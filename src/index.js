exports.handler = async (event, context) => {
  // console.log("value1 = " + event.key1);
  // console.log("value2 = " + event.key2);
  console.log("event: ", event); // eslint-disable-line
  console.log("context: ", context); // eslint-disable-line
  // return "some success message";
  // or
  // throw new Error({body: "some error type", statusCode: 501 })
    return {body: 'Pong' }
}
