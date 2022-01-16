const express = require("express");
const router = express.Router();
const eventsController = require("../controllers/events.controller")

router.route("/events")
      .get(eventsController.getAll)
      .post(eventsController.addOne)
module.exports = router;