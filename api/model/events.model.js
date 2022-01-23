const mongoose = require("mongoose");

const attendeeSchema = new mongoose.Schema({
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
    place: {
      type: String,
      required: true
    },
    coordinates: {
      type: [Number],
      index: "2dsphere"
    }
  },
  attendees: [attendeeSchema]
}, {
  versionKey: false,
}, );

mongoose.model(process.env.MAIN_MODEL_NAME, eventsSchema, process.env.MAIN_COLLECTION_NAME);
