const mongoose = require('mongoose');
const path = require("path")
const {
  getResponse,
  postResponse,
  putResponse
} = require("../utils/responseHandler")

const Event = mongoose.model('Event');

module.exports.getAll = (req, res) => {
  let count = parseInt(process.env.GET_ALL_DEFAULT_COUNT);
  let offset = parseInt(process.env.GET_ALL_DEFAULT_OFFSET);

  if (req.query.count) {
    count = parseInt(req.query.count);
  }
  if (req.query.offset) {
    offset = parseInt(req.query.offset);
  }

  if (isNaN(count) || isNaN(offset)) {
    console.log("ERROR : @ " + path.basename(__filename) + " -- Either count or offset is not a number");

    res.status(400).json({
      message: "Both count and offset should be numbers"
    });
    return;
  }

  if (count > process.env.GET_ALL_MAX_COUNT) {
    console.log("ERROR : @ " + path.basename(__filename) + " -- count exceeds the the max count");

    res.status(400).json({
      message: "Cannot exceed count of " + process.env.GET_ALL_MAX_COUNT,
    });
    return;
  }

  Event.find().skip(offset).limit(count).exec(function (err, data) {
    console.log("DATABASE CALL : @ " + path.basename(__filename) + " : with count " + count, " offset " + offset);
    
    const response = getResponse(err, data);
    res.status(response.status).json(response.message);
  });
};

module.exports.getOne = (req, res) => {
  Event.findById(req.params.eventId).exec(function (err, data) {
    const response = getResponse(err, data)
    res.status(response.status).json(response.message);
  })
}

module.exports.addOne = (req, res) => {
  const event = {
    name: req.body.name,
    description: req.body.description,
    location: req.body.location
  }

  Event.create(event, function (err, data) {
    const response = postResponse(err, data)
    res.status(response.status).json(response.message);
  })
}

module.exports.fullUpdate = (req, res) => {
  const eventId = req.params.eventId  
  Event.findById(eventId).exec(function (err, data) {
    const response = getResponse(err, data)
    if (response.status >= 400) {
      res.status(response.status).json(response.message);
      return;
    }

    data.name = req.body.name
    data.description = req.body.description
    data.location = req.body.location

    data.save(function (err, doc) {
      const response = putResponse(err, doc);

      res.status(response.status).json(response.message);
    });

  })
}