const Movie = require('../models/Movie');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');


exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addMovie = async (req, res) => {
  try {
    const { name, seatsAvailable, time } = req.body;
    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({ message: 'No image provided' });
    }
    const imageFileName = Date.now() + '-' + imageFile.originalname;
    const imagepath = `http://localhost:4000/uploads/${imageFileName}`.replace(/\\/g, '/');

    const movie = await Movie.create({ name,totalSeats:seatsAvailable, seatsAvailable, time, image: imagepath });
    res.json({ message: 'Movie added successfully', movie });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    if (movie.seatsAvailable < movie.totalSeats) {
      return res.status(403).json({ message: 'Cannot delete movie with occupied seats' });
    }

    const imageFileName = path.basename(movie.image);
    await movie.remove();
    const imagePath = path.join(__dirname, '..', 'uploads', imageFileName);
    fs.unlinkSync(imagePath);
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.bookSeats = async (req, res) => {
  try {
    const { movieId, userId, seats } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    if (seats > movie.seatsAvailable || seats < 1 || seats > 4) {
      return res.status(400).json({ message: 'Invalid number of seats' });
    }
    if (user.bookedSeats + seats > 4) {
      return res.status(400).json({ message: 'Exceeded maximum booked seats limit (4)' });
    }
    movie.seatsAvailable -= seats;
    user.bookedSeats += seats;
    await movie.save();
    await user.save();
    res.json({ message: 'Seats booked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { movieId, userId, seatsToCancel } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    const bookedSeats = user.bookedSeats;
    if (bookedSeats === 0) {
      return res.status(400).json({ message: 'No booked seats to cancel' });
    }
    if (seatsToCancel < 1 || seatsToCancel > bookedSeats) {
      return res.status(400).json({ message: 'Invalid number of seats to cancel' });
    }
    movie.seatsAvailable += seatsToCancel;
    user.bookedSeats -= seatsToCancel;
    await movie.save();
    await user.save();
    res.json({ message: 'Booking canceled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
