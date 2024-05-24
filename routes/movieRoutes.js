const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });

router.get('/', movieController.getAllMovies);
router.post('/', authMiddleware.checkAdmin,upload.single('image'), movieController.addMovie);
router.delete('/:id', authMiddleware.checkAdmin, movieController.deleteMovie);
router.post('/book', authMiddleware.checkUser, movieController.bookSeats);
router.post('/cancel', authMiddleware.checkUser, movieController.cancelBooking);

module.exports = router;
