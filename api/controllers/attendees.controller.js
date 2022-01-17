const mongoose = require('mongoose');
const path = require("path")
const {validateForPagination} = require("../helpers/validator")

const {
  getResponse,
  postResponse,
  putResponse,
  deleteResponse
} = require("../helpers/responseHandler")

const notFoundMessage = (attendeeId) => {
  return {"message": process.env.ATTENDEE_NOT_FOUND_MESSGAE + attendeeId}
}
const Event = mongoose.model('Event');

module.exports.getAll = (req, res) => {
  const eventId = req.params.eventId
  let count = parseInt(process.env.GET_ALL_ATTENDEES_DEFAULT_COUNT);
  let offset = parseInt(process.env.GET_ALL_ATTENDEES_DEFAULT_OFFSET);

  if (req.query.count) {
    count = parseInt(req.query.count);
  }
  if (req.query.offset) {
    offset = parseInt(req.query.offset);
  }

  if (!validateForPagination(count,offset,process.env.GET_ALL_ATTENDEES_MAX_COUNT, res)) {
    return;
  }

  _findById(Event, count, offset,eventId, res)

};

const _findById = (Event, count, offset, eventId, res) => {
  Event.findById(eventId).select('attendees').slice('attendees', [offset, count]).exec(function (err, data) {
    const response = getResponse(err, data)
    if (response.status === 200) {
      response.message = response.message.attendees
    }
    res.status(response.status).json(response.message);
  })
}

module.exports.getOne = (req, res) => {
  const eventId = req.params.eventId
  const attendeeId = req.params.attendeeId
  Event.findById(eventId).select('attendees').exec(function (err, data) {
    const response = getResponse(err, data)
    if (response.status >= 400) {
      res.status(response.status).json(response.message);
      return;
    }

    response.message = response.message.attendees.id(attendeeId)

    if (!response.message) {
      response.status = 404
      response.message = notFoundMessage(attendeeId)
    }

    res.status(response.status).json(response.message);
  })
}

module.exports.create = (req, res) => {
  const eventId = req.params.eventId

  Event.findById(eventId).select('attendees').exec(function (err, data) {

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
  const attendeeId = req.params.attendeeId
  Event.findById(eventId).select('attendees').exec(function (err, data) {
    const response = getResponse(err, data)
    if (response.status >= 400) {
      res.status(response.status).json(response.message);
      return;
    }

    const attendee = data.attendees.id(attendeeId)
    if (!attendee) {
      res.status(404).json(notFoundMessage(attendeeId));
      return;
    }
    attendee.name = req.body.name
    attendee.rsvp = req.body.rsvp

    data.save(function (err, data) {
      const response = putResponse(err, data);
      res.status(response.status).json(attendee);
    });

  })
}

module.exports.delete = (req, res) => {
  const eventId = req.params.eventId
  const attendeeId = req.params.attendeeId
  Event.findById(eventId).select('attendees').exec(function (err, data) {
    const response = getResponse(err, data)
    if (response.status >= 400) {
      res.status(response.status).json(response.message);
      return;
    }

    const attendee = data.attendees.id(attendeeId)
    if (!attendee) {
      res.status(404).json(notFoundMessage(attendeeId));
      return;
    }
    
    data.attendees.id(attendeeId).remove()

    data.save(function (err, data) {
      const response = deleteResponse(err, data);
      res.status(response.status).json(response.message);
    });
  })
}