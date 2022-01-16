require("dotenv").config();

const express = require('express')
const app = express()
const path = require("path")
const routes = require("./api/routes")

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname, "public")))

// app.use("/api", routes)

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'public/404.html'));
});

const server = app.listen(process.env.PORT, function() {
  console.log(process.env.MSG_SERVER_START + server.address().port);
})