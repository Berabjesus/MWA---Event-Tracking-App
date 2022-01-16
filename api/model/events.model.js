const mongoose = require("mongoose");

const eventsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  location: {
    type: String
  },
},{
  versionKey: false,
},);

mongoose.model(process.env.MODEL_NAME, eventsSchema, process.env.COLLECTION_NAME);
