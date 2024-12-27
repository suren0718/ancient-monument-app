const express = require('express');
const { registerUser, loginUser, addFavoriteMonument } = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/favorite', addFavoriteMonument);

module.exports = router;
