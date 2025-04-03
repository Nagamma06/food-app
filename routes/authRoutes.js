const express = require('express')
const router = express.Router()
const {registerController, loginController} = require('../controllers/authController')

//routes
//REGISTER || POST
router.post('/register',registerController)
//LOGIN
router.post('/login',loginController)

module.exports = router