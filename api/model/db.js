const mongoose = require("mongoose");
require("./events.model");

mongoose.connect(process.env.DB_CONN_URL + process.env.DB_NAME, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.on("connected", function () {
  console.log("connection to " + process.env.DB_NAME + " database successful");
});

mongoose.connection.on("error", function () {
  console.log("error connecting to " + process.env.DB_NAME + " database");
});

process.on("SIGINT", function () {
  mongoose.connection.close(function () {
    console.log("Mongoose disconnected by app disconnect");
    process.exit(0);
  });
});

process.on("SIGTERM", function () {
  mongoose.connection.close(function () {
    console.log("Mongoose disconnected by app termination");
    process.exit(0);
  });
});

process.once("SIGUSR2", function () {
  mongoose.connection.close(function () {
    console.log("Mongoose disconnected by app restart");
    process.kill(process.pid, "SINGUSR2");
  });
});
