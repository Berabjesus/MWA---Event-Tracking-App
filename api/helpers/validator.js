const path = require("path")

module.exports.validateForPagination = (count, offset, max, res) => {
  if (isNaN(count) || isNaN(offset)) {
    console.log("ERROR : @ " + path.basename(__filename) + " -- Query parameters should be numbers");

    res.status(400).json({
      message: " Query parameters should be numbers "
    });
    return;
  }

  if (count > max) {
    console.log("ERROR : @ " + path.basename(__filename) + " -- count exceeds the the max count");

    res.status(400).json({
      message: "Cannot exceed count of " + max,
    });
    return;
  }
  return true;
}