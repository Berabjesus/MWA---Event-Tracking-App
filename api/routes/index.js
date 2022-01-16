const express = require("express");
const router = express.Router();

router.route("/events")
      .get(function(req, res) {
        console.log(req);
        res.status(200).json({"msg" : "get all events"})
      })

module.exports = router;