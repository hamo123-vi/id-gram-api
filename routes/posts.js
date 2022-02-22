const express = require('express');
const { protect } = require('../middleware/auth')
const { uploadPost, like, comment, myPosts, explorePosts, usersPosts, followingPosts } = require('../controllers/posts');

const router = express.Router();

router.route('/upload').post(protect, uploadPost)
router.route('/like/:id').put(protect, like)
router.route('/comment/:id').put(protect, comment)
router.route('/my').get(protect, myPosts)
router.route('/explore').get(protect, explorePosts)
router.route('/following').get(protect, followingPosts)
router.route('/user/:id').get(protect, usersPosts)

module.exports = router;