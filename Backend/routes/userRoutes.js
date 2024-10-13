const express = require('express');
const userController = require('../controllers/userController.js');
const router = express.Router();

router.post('/register', userController.register);
router.get('/:id', userController.getUser);

module.exports = router;