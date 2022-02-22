const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth')
const { follow, getUsers, getUser } = require('../controllers/users');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

router.route('/follow/:id').put(protect, follow);
router.route('/').get(advancedResults(User), getUsers);
router.route('/:id').get(getUser);

module.exports = router;