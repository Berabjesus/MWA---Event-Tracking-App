const mongoose = require("mongoose");

const attendeeSchema =  new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  },
  rsvp: {
    type: String,
    enum: ['YES', 'NO', 'MAY BE'],
    uppercase: true,
    required: true
  }
})

const eventsSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  description: {
    type: String,
    maxlength: 500,
  },
  location: {
    type: String,
    required: true
  },
  attendees: [attendeeSchema]
},{
  versionKey: false,
},);

mongoose.model(process.env.MODEL_NAME, eventsSchema, process.env.COLLECTION_NAME);
