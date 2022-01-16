const path = require("path")

module.exports.getResponse = (err, data) => {
  const response = {
    status: 200,
    message: data,
  };

  if (err) {
    console.log("ERROR : @ " + path.basename(__filename) + " : --" + err);
    response.status = 500;
    response.message = err;
  } else if (!data) {
    console.log("WARNING : @ " + path.basename(__filename) + " : -- data not found");
    response.status = 404;
    response.message = {
      message: "No data found"
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
    console.log("ERROR : @ " + path.basename(__filename) + " : --" + err);
    response.status = 500;
    response.message = err;
  }

  return response;
};