require("dotenv").config();

const express = require('express')
const app = express()
const path = require("path")
const routes = require("./api/routes")

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname, "public")))

const server = app.listen(process.env.PORT, function() {
  console.log(`listening on port ${server.address().port}`);
})