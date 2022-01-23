const mongoose = require('mongoose');
const path = require("path")
const {
  validateForPagination,
  validateForId
} = require("../helpers/validator.helper")

const {
  getResponse,
  postResponse,
  updateResponse,
  deleteResponse
} = require("../helpers/responseHandler.helper")

const fileName = path.basename(__filename)

const Event = mongoose.model('Event');

const getAll = (req, res) => {
  const eventId = req.params.eventId
  let count = parseInt(process.env.GET_ALL_ATTENDEES_DEFAULT_COUNT);
  let offset = parseInt(process.env.GET_ALL_ATTENDEES_DEFAULT_OFFSET);
  const max = parseInt(process.env.GET_ALL_ATTENDEES_MAX_COUNT, 10)

  if (req.query.count) {
    count = parseInt(req.query.count);
  }
  if (req.query.offset) {
    offset = parseInt(req.query.offset);
  }

  const validationResponse = validateForPagination(count, offset, max, fileName)
  if (!validationResponse.ok) {
    res.status(400).json(validationResponse.message)
    return;
  }

  _findById(Event, count, offset, eventId, res)

};

const _findById = (Event, count, offset, eventId, res) => {
  Event.findById(eventId).select('attendees').slice('attendees', [offset, count]).exec(function (err, data) {
    const response = getResponse(err, data, fileName)
    if (response.status === 200) {
      response.message = response.message.attendees
    }
    res.status(response.status).json(response.message);
  })
}

const getOne = (req, res) => {
  const eventId = req.params.eventId
  const attendeeId = req.params.attendeeId

  const idValidation = validateForId(mongoose, [eventId, attendeeId], fileName)
  if (!idValidation.ok) {
    res.status(400).json(idValidation.message)
    return
  }

  Event.findById(eventId).select('attendees').exec(function (err, data) {
    const response = getResponse(err, data, fileName)
    if (response.status != 200) {
      res.status(response.status).json(response.message);
      return;
    }

    response.message = response.message.attendees.id(attendeeId)

    if (!response.message) {
      response.status = 404
      response.message = {error : process.env.ERROR_MSG_SUB_DATA_NOT_FOUND}
    }

    res.status(response.status).json(response.message);
  })
}

const addOne = (req, res) => {
  const eventId = req.params.eventId

  Event.findById(eventId).select('attendees').exec(function (err, data) {

    const response = getResponse(err, data, fileName)
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
      const response = postResponse(err, data, fileName);

      res.status(response.status).json(attendee);
    });
  })
}

const _updateOne = (req, res, updateAttendeeCallback) => {
  const eventId = req.params.eventId
  const attendeeId = req.params.attendeeId

  const idValidation = validateForId(mongoose, [eventId, attendeeId], fileName)
  if (!idValidation.ok) {
    res.status(400).json(idValidation.message)
    return
  }

  Event.findById(eventId).select('attendees').exec(function (err, event) {
    const response = getResponse(err, event, fileName)
    if (response.status !== 200) {
      res.status(response.status).json(response.message)
    }

    const attendee = event.attendees.id(attendeeId)
    if (!attendee) {
      res.status(404).json({error : process.env.ERROR_MSG_SUB_DATA_NOT_FOUND})
      return;
    } else {
      updateAttendeeCallback(req, res, event, attendee)
    }
  })
}

const fullUpdateCallback = (req, res, event, attendee) => {
  attendee.name = req.body.name
  attendee.rsvp = req.body.rsvp

  event.save(function (err, updatedEvent) {
    const response = updateResponse(err, attendee, fileName)
    res.status(response.status).json(response.message)
  })
}

const partialUpdateCallback = (req, res, event, attendee) => {
  attendee.name = req.body.name || attendee.name
  attendee.rsvp = req.body.rsvp || attendee.rsvp

  event.save(function (err, updatedEvent) {
    const response = updateResponse(err, attendee, fileName)
    res.status(response.status).json(response.message)
  })
}

const fullUpdateOne = (req, res) => {
  _updateOne(req, res, fullUpdateCallback)
}

const partialUpdateOne = (req, res) => {
  _updateOne(req, res, partialUpdateCallback)
}

const removeOne = (req, res) => {
  const eventId = req.params.eventId
  const attendeeId = req.params.attendeeId
  Event.findById(eventId).select('attendees').exec(function (err, event) {
    const response = getResponse(err, event, fileName)
    if (response.status != 200) {
      res.status(response.status).json(response.message);
      return;
    }

    const attendee = event.attendees.id(attendeeId)
    if (!attendee) {
      res.status(404).json({error : process.env.ERROR_MSG_SUB_DATA_NOT_FOUND})
      return;
    }

    event.attendees.id(attendeeId).remove()

    event.save(function (err, updatedEvent) {
      const response = deleteResponse(err, updatedEvent, fileName);
      res.status(response.status).json(response.message);
    });
  })
}

module.exports = {
  getAll,
  getOne,
  addOne,
  removeOne,
  fullUpdateOne,
  partialUpdateOne
}