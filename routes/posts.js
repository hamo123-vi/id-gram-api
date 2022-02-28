const express = require('express');
const multer = require('multer');
const storage = require('../utils/fileStorage');
const advancedResults = require('../middleware/advancedResults');
const Post = require('../models/Post')
const { protect } = require('../middleware/auth')
const { uploadPost, like, comment, myPosts, explorePosts, usersPosts, followingPosts } = require('../controllers/posts');

const router = express.Router();
   
var upload = multer({ storage: storage })

router.route('/upload').post(protect, uploadPost, upload.single('image'))
router.route('/like/:id').put(protect, like)
router.route('/comment/:id').put(protect, comment)
router.route('/my').get(protect, advancedResults(Post), myPosts)
router.route('/explore').get(protect, advancedResults(Post), explorePosts)
router.route('/following').get(protect, advancedResults(Post), followingPosts)
router.route('/user/:id').get(protect, usersPosts)

module.exports = router;