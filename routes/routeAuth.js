
const express = require("express");
const router = express.Router();

const {protect} = require('../middleware/auth')

const {register, login, getMe, forgotPassword, resetPassword, updateUser, logout} = require('../controllers/ctrlAuth')

router.post('/register', register) 
router.post('/login', login) 
router.get('/logout', logout)
router.get('/me', protect, getMe)
router.post('/forgotPassword', forgotPassword)
router.put('/resetpassword/:resettoken', resetPassword)
router.put('/updateuser', protect, updateUser)



module.exports = router; 
