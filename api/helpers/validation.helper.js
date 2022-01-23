const path = require("path")
const {
  errorLogger
} = require("./logger.helper")

const validateForPagination = (count, offset, max, fileName) => {

  const response = {
    ok: true,
    message: ""
  }

  if (isNaN(count) || isNaN(offset)) {
    const message = process.env.ERROR_MSG_NOT_A_NUMBER
    errorLogger(fileName, message)

    response.ok = false;
    response.message = message
  }

  if (count > max) {
    const message = process.env.ERROR_MSG_INVALID_COUNT + max
    errorLogger(fileName, message)

    response.ok = false;
    response.message = message
  }
  return response;
}

const validateForId = (mongoose, idArray, fileName) => {
  const response = {
    ok: true,
    message: ""
  }
  idArray.forEach(id => {
    if (!mongoose.isValidObjectId(id)) {
      const message = {
        error: process.env.ERROR_MSG_INVALID_ID
      }
      errorLogger(fileName, message)
      response.ok = false;
      response.message = message
    }
  });

  return response
}

module.exports = {
  validateForPagination,
  validateForId
}