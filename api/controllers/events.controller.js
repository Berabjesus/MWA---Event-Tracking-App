const mongoose = require('mongoose');
const {validateForPagination, validateForId } = require("../helpers/validator.helper")
const {
  getResponse,
  postResponse,
  updateResponse,
  deleteResponse
} = require("../helpers/responseHandler.helper");
const { infoLogger } = require('../helpers/logger.helper');
const path = require("path")
const fileName = path.basename(__filename)

const Event = mongoose.model('Event');

const getAll = (req, res) => {
  let count = parseInt(process.env.GET_ALL_EVENTS_DEFAULT_COUNT, 10);
  let offset = parseInt(process.env.GET_ALL_EVENTS_DEFAULT_OFFSET, 10);
  const max = parseInt(process.env.GET_ALL_ATTENDEES_MAX_COUNT, 10)

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

  const validationResponse = validateForPagination(count,offset,max,fileName)
  if (!validationResponse.ok) {
    res.status(400).json(validationResponse.message)
    return;
  }

  _find(Event, count, offset, res)
};

const _find = (Event, count, offset, res) => {
  Event.find().select('-attendees').skip(offset).limit(count).exec(function (err, event) {
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

  if (distance > maxDistance) {
    const message = process.env.ERROR_MSG_EXCEED_MAX_DISTANCE
    res.status(400).json(message)
    return
  }

  const point = {
    type: "Point",
    coordinates: [longitude,latitude]
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

  const idValidation = validateForId(mongoose, eventId)
  if (!idValidation.ok) {
    res.status(400).json(idValidation.message)
  }

  Event.findById(eventId).select('-attendees').exec(function (err, event) {
    const response = getResponse(err, event, fileName)
    res.status(response.status).json(response.message);
  })
}

const addOne = (req, res) => {
  const event = {
    name: req.body.name,
    description: req.body.description,
    location: req.body.location,
    attendees: req.body.attendees
  }

  Event.create(event, function (err, event) {
    const response = postResponse(err, event, fileName)
    res.status(response.status).json(response.message);
  })
}

const _updateOne = (req, res, updateEventCallback) => {
  const eventId = req.params.eventId

  const idValidation = validateForId(mongoose, eventId)
  if (!idValidation.ok) {
    res.status(400).json(idValidation.message)
  }

  Event.findById(eventId).select('-attendees').exec(function (err, event) {
    const response = getResponse(err, event, fileName)
    if (response.status !== 200) {
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
    const response = updateResponse(err, updatedEvent,fileName)
    res.status(response.status).json(response.message)
  })
}

const partialUpdateCallback = (req, res, event) => {
  event.name = req.body.name || event.name
  event.description = req.body.description || event.description
  event.location = req.body.location || event.location

  event.save(function (err, updatedEvent) {
    const response = updateResponse(err, updatedEvent,fileName)
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
    const response = deleteResponse(err, event,fileName)
    res.status(response.status).json(response.message);
  })
}

module.exports = {
  getAll,getOne, addOne, removeOne, fullUpdateOne, partialUpdateOne
}