const { errorLogger, infoLogger } = require("./logger.helper")
const path = require("path")

const _errorHandler = (err, fileName, response) => {
  errorLogger(err, fileName)
  response.status = 500;
  response.message = {
    error : err.message || err
  }
  return response;
}

const _noDataFoundHandler = (fileName, response) => {
  const message = process.env.ERROR_MSG_DATA_NOT_FOUND
  errorLogger(message, fileName);
  response.status = 404;
  response.message = {
    error : message
  }
  return response
}

const getResponse = (err, data, fileName) => {
  let response = {
    status: 200,
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
    status: 201,
    message: data
  }

  if (err) {
    response = _errorHandler(err, fileName, response)
  } 
  return response
}

const updateResponse = (err, data, fileName) => {
  let response = {
    status: 202,
    message: data
  }

  if (err) {
    response = _errorHandler(err, fileName, response)
  } 
  return response
}

const deleteResponse = (err, data, fileName) => {
  let response = {
    status: 204,
    message: data,
  };

  if (err) {
    response = _errorHandler(err, fileName, response)
  } else if (!data) {
    response = _noDataFoundHandler(fileName, response)
  } else {
    infoLogger(fileName, process.env.INFO_MSG_DATA_DELETED);
  }

  return response;
};

module.exports = {
  getResponse,
  postResponse,
  updateResponse,
  deleteResponse
}