const mongoose = require('mongoose');
const {
  validateForPagination,
  validateForId,
  validateForCoordinates
} = require("../helpers/validation.helper")
const {
  getResponse,
  postResponse,
  updateResponse,
  deleteResponse
} = require("../helpers/response.helper");
const {
  infoLogger
} = require('../helpers/logger.helper');
const path = require("path");
const req = require('express/lib/request');
const fileName = path.basename(__filename)

const Event = mongoose.model('Event');

const getAll = (req, res) => {
  let count = parseInt(process.env.GET_ALL_EVENTS_DEFAULT_COUNT, 10);
  let offset = parseInt(process.env.GET_ALL_EVENTS_DEFAULT_OFFSET, 10);
  const max = parseInt(process.env.GET_ALL_EVENTS_MAX_COUNT, 10)

  if (req.query.count) {
    count = parseInt(req.query.count);
  }
  if (req.query.offset) {
    offset = parseInt(req.query.offset);
  }

  if (req.query.lat && req.query.lng) {
    _runGeoQuery(req, res);
    return;
  }

  const validationResponse = validateForPagination(count, offset, max, fileName)
  if (!validationResponse.ok) {
    res.status(process.env.STATUS_BAD_REQUEST).json(validationResponse.message)
    return;
  }

  _find(Event, count, offset, req, res)
};

const _find = (Event, count, offset, req, res) => {
  let query = {}
  if (req.query.search) {
    if (req.query.place) {
      query = {
        "location.place": req.query.search
      }
    } else {
      query = {
        name: req.query.search
      }
    }

  }

  Event.find(query).select('-attendees').skip(offset).limit(count).exec(function (err, event) {
    infoLogger(fileName, process.env.INFO_MSG_DB_QUERY_MADE)
    const response = getResponse(err, event, fileName);
    res.status(response.status).json(response.message);
  });
}

const _runGeoQuery = function (req, res) {
  const longitude = parseFloat(req.query.lng, 10);
  const latitude = parseFloat(req.query.lat, 10);
  const distance = parseFloat(req.query.dist, 10);
  const maxDistance = parseFloat(process.env.GEO_SEARCH_MAX_DIST, 10)


  const coordinateValidation = validateForCoordinates(latitude, longitude, fileName)
  if (!coordinateValidation.ok) {
    res.status(process.env.STATUS_BAD_REQUEST).json(coordinateValidation.message)
    return;
  }

  if (distance > maxDistance) {
    const message = process.env.ERROR_MSG_EXCEED_MAX_DISTANCE
    res.status(process.env.STATUS_BAD_REQUEST).json(message)
    return
  }

  const point = {
    type: "Point",
    coordinates: [longitude, latitude]
  };

  Event.aggregate([{
    "$geoNear": {
      "near": point,
      "spherical": true,
      "distanceField": "distance",
      "maxDistance": distance || parseFloat(process.env.GEO_SEARCH_MAX_DIST, 10),
      "minDistance": parseFloat(process.env.GEO_SEARCH_MIN_DIST, 10)
    }
  }, {
    "$limit": parseFloat(process.env.GET_ALL_EVENTS_DEFAULT_COUNT, 10)
  }], function (err, event) {

    const response = getResponse(err, event, fileName)
    res.status(response.status).json(response.message)
  });
}

const getOne = (req, res) => {
  const eventId = req.params.eventId;

  const idValidation = validateForId(mongoose, [eventId], fileName)
  if (!idValidation.ok) {
    res.status(process.env.STATUS_BAD_REQUEST).json(idValidation.message)
    return
  }

  Event.findById(eventId).select('-attendees').exec(function (err, event) {
    const response = getResponse(err, event, fileName)
    res.status(response.status).json(response.message);
  })
}

const addOne = (req, res) => {
  console.log(req.body.location);
  const event = {
    name: req.body.name,
    description: req.body.description,
    location: req.body.location,
    attendees: req.body.attendees
  }
  console.log(event.location.coordinates);
  if (event.location && event.location.coordinates) {
    const coordinateValidation = validateForCoordinates(event.location.coordinates[0], event.location.coordinates[1],fileName)
    if (!coordinateValidation.ok) {
      res.status(process.env.STATUS_BAD_REQUEST).json(coordinateValidation.message)
      return;
    }
  }




  Event.create(event, function (err, event) {
    const response = postResponse(err, event, fileName)
    res.status(response.status).json(response.message);
  })
}

const _updateOne = (req, res, updateEventCallback) => {
  const eventId = req.params.eventId

  const idValidation = validateForId(mongoose, [eventId], fileName)
  if (!idValidation.ok) {
    res.status(process.env.STATUS_BAD_REQUEST).json(idValidation.message)
    return
  }

  Event.findById(eventId).select('-attendees').exec(function (err, event) {
    const response = getResponse(err, event, fileName)
    if (response.status !== process.env.STATUS_OK) {
      res.status(response.status).json(response.message)
    } else {
      updateEventCallback(req, res, event)
    }
  })
}

const fullUpdateCallback = (req, res, event) => {
  event.name = req.body.name
  event.description = req.body.description
  event.location = req.body.location

  event.save(function (err, updatedEvent) {
    const response = updateResponse(err, updatedEvent, fileName)
    res.status(response.status).json(response.message)
  })
}

const partialUpdateCallback = (req, res, event) => {
  event.name = req.body.name || event.name
  event.description = req.body.description || event.description
  event.location = req.body.location || event.location

  event.save(function (err, updatedEvent) {
    const response = updateResponse(err, updatedEvent, fileName)
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
  Event.findByIdAndRemove(eventId).exec(function (err, event) {
    const response = deleteResponse(err, event, fileName)
    res.status(response.status).json(response.message);
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