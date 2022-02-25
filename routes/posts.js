const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/auth')
const { uploadPost, like, comment, myPosts, explorePosts, usersPosts, followingPosts } = require('../controllers/posts');

const router = express.Router();

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
   
  var upload = multer({ storage: storage })

router.route('/upload').post(protect, uploadPost, upload.single('cv'))
router.route('/like/:id').put(protect, like)
router.route('/comment/:id').put(protect, comment)
router.route('/my').get(protect, myPosts)
router.route('/explore').get(protect, explorePosts)
router.route('/following').get(protect, followingPosts)
router.route('/user/:id').get(protect, usersPosts)

module.exports = router;