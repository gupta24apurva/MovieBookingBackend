const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');

exports.checkUser = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

exports.checkAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);
    console.log(decoded.username)
    if (decoded.username === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Forbidden' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
