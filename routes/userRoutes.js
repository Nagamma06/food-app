const express = require('express');
const { userController } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/getuser', authMiddleware, userController)

module.exports = router