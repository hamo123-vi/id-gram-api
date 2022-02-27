const express = require('express');
const multer = require('multer');
const storage = require('../utils/fileStorage')
const { protect } = require('../middleware/auth')
const {
    register,
    login,
    getMe,
    updateDetails
} = require('../controllers/auth');
const router = express.Router();

var upload = multer({storage: storage})


router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/updatedetails', protect, updateDetails, upload.single('image'));

module.exports = router;