const express = require('express');
const { userController, updateUserController, passwordUpdateController, sendResetPasswordLink, resetUserPasswordController, deleteUserProfileController } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
//Get User
router.get('/getuser', authMiddleware, userController)

//Update User
router.put('/updateuser', authMiddleware, updateUserController)
// Password Update
router.post('/updatePassword',authMiddleware, passwordUpdateController)
//get Reset user password link
router.post('/getResetPasswordLink',sendResetPasswordLink)
//reset user password
router.post('/resetPassword',resetUserPasswordController)
//delete user profile
router.delete('/deleteUser',authMiddleware,deleteUserProfileController)


module.exports = router