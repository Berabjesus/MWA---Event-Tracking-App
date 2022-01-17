const path = require("path")
const fileName = path.basename(__filename);

module.exports.getResponse = (err, data) => {
  const response = {
    status: 200,
    message: data,
  };

  if (err) {
    console.log("ERROR : @ " + fileName + " : --" + err);
    response.status = 500;
    response.message = err;
  } else if (!data) {
    console.log("WARNING : @ " + fileName + " : -- Event not found");
    response.status = 404;
    response.message = {
      message: "No Event found"
    };
  }

  return response;
};

module.exports.postResponse = function (err, data) {
  const response = {
    status: 201,
    message: data,
  };

  if (err) {
    console.log("ERROR : @ " + fileName + " : --" + err);
    response.status = 500;
    response.message = err;
  }

  return response;
};

module.exports.putResponse = (err, data) => {
  const response = {
    status: 202,
    message: data,
  };

  if (err) {
    console.log("ERROR : @ " + fileName + " : --" + err);
    response.status = 500;
    response.message = err;
  }

  return response;
};

module.exports.deleteResponse = (err, data) => {
  const response = {
    status: 204,
    message: data,
  };

  if (err) {
    console.log("ERROR : @ " + fileName + " : --" + err);
    response.status = 500;
    response.message = err;
  } else if (!data) {
    console.log("WARNING : @ " + fileName + " : -- data not found");
    response.status = 404;
    response.message = {
      message: "No data found"
    };
  } else {
    console.log("INFO : @ " + fileName + " : -- data deleted");
  }

  return response;
};