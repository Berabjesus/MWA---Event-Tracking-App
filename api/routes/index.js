const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/events.controller")

router.route("/events")
  .get(eventsController.getAll)
  .post(eventsController.addOne)

router.route("/events/:eventId")
  .get(eventsController.getOne)
  .put(eventsController.fullUpdate)

module.exports = router;