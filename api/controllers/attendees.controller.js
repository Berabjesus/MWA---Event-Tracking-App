const mongoose = require('mongoose');
const path = require("path")
const {
  getResponse,
  postResponse,
  putResponse,
  deleteResponse
} = require("../helpers/responseHandler")

const Event = mongoose.model('Event');

module.exports.getAll = (req, res) => {
  let count = parseInt(process.env.GET_ALL_ATTENDEES_DEFAULT_COUNT);
  let offset = parseInt(process.env.GET_ALL_ATTENDEES_DEFAULT_OFFSET);

  if (req.query.count) {
    count = parseInt(req.query.count);
  }
  if (req.query.offset) {
    offset = parseInt(req.query.offset);
  }

  if (isNaN(count) || isNaN(offset)) {
    console.log("ERROR : @ " + path.basename(__filename) + " -- Query parameters should be numbers");

    res.status(400).json({
      message: " Query parameters should be numbers "
    });
    return;
  }

  if (count > process.env.GET_ALL_ATTENDEES_MAX_COUNT) {
    console.log("ERROR : @ " + path.basename(__filename) + " -- count exceeds the the max count");

    res.status(400).json({
      message: "Cannot exceed count of " + process.env.GET_ALL_ATTENDEES_MAX_COUNT,
    });
    return;
  }

  Event.findById(req.params.eventId).select('attendees').slice('attendees', [offset, count]).exec(function (err, data) {
    const response = getResponse(err, data)
    if (response.status === 200) {
      response.message = response.message.attendees
    }
    res.status(response.status).json(response.message);
  })

};

module.exports.getOne = (req, res) => {
  Event.findById(req.params.eventId).select('attendees').exec(function (err, data) {
    const response = getResponse(err, data)
    if (response.status >= 400) {
      res.status(response.status).json(response.message);
      return;
    }

    response.message = response.message.attendees.id(req.params.attendeeId)

    if (!response.message) {
      response.status = 404
      response.message = {
        "message": "No attendee with id " + req.params.attendeeId + " found"
      }
    }

    res.status(response.status).json(response.message);
  })
}

module.exports.create = (req, res) => {
  Event.findById(req.params.eventId).select('attendees').exec(function (err, data) {

    const response = getResponse(err, data)
    if (response.status >= 400) {
      res.status(response.status).json(response.message);
      return;
    }

    const attendee = {
      name: req.body.name,
      rsvp: req.body.rsvp
    }

    data.attendees.push(attendee);
    data.save(function (err, data) {
      const response = postResponse(err, data);

      res.status(response.status).json(attendee);
    });
  })
}

module.exports.fullUpdate = (req, res) => {
  const eventId = req.params.eventId
  Event.findById(eventId).select('-attendees').exec(function (err, data) {
    const response = getResponse(err, data)
    if (response.status >= 400) {
      res.status(response.status).json(response.message);
      return;
    }

    data.name = req.body.name
    data.description = req.body.description
    data.location = req.body.location

    data.save(function (err, data) {
      const response = putResponse(err, data);

      res.status(response.status).json(response.message);
    });

  })
}

module.exports.delete = (req, res) => {
  const eventId = req.params.eventId
  Event.findByIdAndRemove(eventId).exec(function (err, data) {
    const response = deleteResponse(err, data)
    res.status(response.status).json(response.message);
  })
}