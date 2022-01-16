const mongoose = require('mongoose');
require("./events.model")

mongoose.connect(process.env.DB_CONN_URL + process.env.DB_NAME, { useUnifiedTopology: true, useNewUrlParser: true });

mongoose.connection.on('connected', function() {
    console.log("connection to " + process.env.DB_NAME + " database successful");
});

mongoose.connection.on('error', function() {
  console.log("error connecting to " + process.env.DB_NAME + " database");
});

