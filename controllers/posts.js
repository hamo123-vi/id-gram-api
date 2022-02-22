const path = require('path')
const User = require('../models/User')
const Post = require('../models/Post')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')

// @desc     Get my posts
// @route    POST/api/v1/posts/my
// @acces    Private
exports.myPosts = asyncHandler( async (req, res, next) => {
    
    const posts = await Post.find({user: Object(req.user.id)});

    if (!posts) {
      return next(new ErrorResponse("Can not fetch single post", 400))
    }

    res.status(200).json({message: 'Success', posts: posts})

});

// @desc     Get explore posts
// @route    POST/api/v1/posts/explore
// @acces    Private
exports.explorePosts = asyncHandler( async (req, res, next) => {
    
    const posts = await Post.find({user: { $ne: Object(req.user.id) } } );

    if (!posts) {
      return next(new ErrorResponse("Can not fetch all posts to explore", 400))
    }

    res.status(200).json({message: 'Success', posts: posts})

});

// @desc     Upload post
// @route    POST/api/v1/posts/upload
// @acces    Private
exports.uploadPost = asyncHandler( async (req, res, next) => {
    
    const file = req.files.image;

    if (!file) {
      return next(new ErrorResponse("Please upload image", 400))
    }

    file.mv(`${process.env.POST_UPLOAD_PATH}/${file.name}`, async err => {
      if(err) {
          return next(
              new ErrorResponse('Problem with image upload', 500))
            } else {
                await Post.create({
                image: file.name,
                description: req.body.description,
                user: req.user.id
            })
  }
  })

  res.status(201).json({message: 'Success'})

});

// @desc     Like post
// @route    PUT/api/v1/posts/like/:id
// @acces    Public
exports.like= asyncHandler( async(req, res, next) => {

    const post = await Post.findById(req.params.id);
    const liker = {user: req.user.id}

    if(!post) {
        return next(new ErrorResponse('Post does not exist in database', 404));
    }

        const likerExists = await Post.find({ $and : [{ likes : { $elemMatch: { user: {$eq: Object(req.user.id) } } } }, {_id: req.params.id}]});

        if(likerExists.length>0) {
            await post.updateOne({ $pull: { likes: liker} });
            await post.save();
            res.status(200).json({success: true, message: "Unliked"})
        }else {
            await post.updateOne({ $push: { likes: liker} });
            await post.save();
            res.status(200).json({success: true, message: "Liked"})
    }

});

// @desc     Comment post
// @route    PUT/api/v1/posts/comment/:id
// @acces    Public
exports.comment= asyncHandler( async(req, res, next) => {

    const post = await Post.findById(req.params.id);
    const comment = {text: req.body.comment, user: req.user.id}

    if(!post) {
        return next(new ErrorResponse('Post does not exist in database', 404));
    }
    
    await post.updateOne({ $push: { comments: comment} });
    await post.save();
    res.status(201).json({success: true, message: "Commented"})
    

});