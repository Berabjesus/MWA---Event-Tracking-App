const { errorLogger, infoLogger } = require("./logger.helper")
const path = require("path")

const _errorHandler = (err, fileName, response) => {
  errorLogger(err, fileName)
  response.status = process.env.STATUS_INTERNAL_ERROR;
  response.message = {
    error : err.message || err
  }
  return response;
}

const _noDataFoundHandler = (fileName, response) => {
  const message = process.env.ERROR_MSG_DATA_NOT_FOUND
  errorLogger(message, fileName);
  response.status = process.env.STATUS_NOT_FOUND;
  response.message = {
    error : message
  }
  return response
}

const getResponse = (err, data, fileName) => {
  let response = {
    status: process.env.STATUS_OK,
    message: data
  }

  if (err) {
    response = _errorHandler(err, fileName, response)
  } else if(!data) {
    response = _noDataFoundHandler(fileName, response)
  }

  return response
}

const postResponse = (err, data, fileName) => {
  let response = {
    status: process.env.STATUS_CREATED,
    message: data
  }

  if (err) {
    response = _errorHandler(err, fileName, response)
  } 
  return response
}

const updateResponse = (err, data, fileName) => {
  let response = {
    status: process.env.STATUS_ACCEPTED,
    message: data
  }

  if (err) {
    response = _errorHandler(err, fileName, response)
  } 
  return response
}

const deleteResponse = (err, data, fileName) => {
  let response = {
    status: process.env.STATUS_NO_CONTENT,
    message: data,
  };

  if (err) {
    response = _errorHandler(err, fileName, response)
  } else if (!data) {
    response = _noDataFoundHandler(fileName, response)
  } else {
    infoLogger(fileName, process.env.INFO_MSG_DATA_DELETED);
    response.message = process.env.INFO_MSG_DATA_DELETED
  }

  return response;
};

module.exports = {
  getResponse,
  postResponse,
  updateResponse,
  deleteResponse
}