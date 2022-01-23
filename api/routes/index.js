const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/events.controller")
const attendeesController = require("../controllers/attendees.controller")

router.route("/events")
  .get(eventsController.getAll)
  .post(eventsController.addOne)

router.route("/events/:eventId")
  .get(eventsController.getOne)
  .put(eventsController.fullUpdateOne)
  .patch(eventsController.partialUpdateOne)
  .delete(eventsController.removeOne)

router.route("/events/:eventId/attendees")
  .get(attendeesController.getAll)
  .post(attendeesController.addOne)

router.route("/events/:eventId/attendees/:attendeeId")
  .get(attendeesController.getOne)
  .put(attendeesController.fullUpdateOne)
  .patch(attendeesController.partialUpdateOne)
  .delete(attendeesController.removeOne)


module.exports = router;