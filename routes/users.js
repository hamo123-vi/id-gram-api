const express = require('express');
const { protect } = require('../middleware/auth')
const {
    follow
} = require('../controllers/users');

const router = express.Router();

router.route('/follow/:id').put(protect, follow);

module.exports = router;