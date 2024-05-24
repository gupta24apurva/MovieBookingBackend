const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  totalSeats: {
    type: Number,
    required: true
  },
  seatsAvailable: {
    type: Number,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Movie', movieSchema);
