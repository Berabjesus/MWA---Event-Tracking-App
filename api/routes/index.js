const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/events.controller")
const attendeesController = require("../controllers/attendees.controller")

router.route("/events")
  .get(eventsController.getAll)
  .post(eventsController.create)

router.route("/events/:eventId")
  .get(eventsController.getOne)
  .put(eventsController.fullUpdate)
  .delete(eventsController.delete)

router.route("/events/:eventId/attendees")
  .get(attendeesController.getAll)
  .post(attendeesController.create)

router.route("/events/:eventId/attendees/:attendeeId")
  .get(attendeesController.getOne)
  .put(attendeesController.fullUpdate)
  .delete(attendeesController.delete)


module.exports = router;