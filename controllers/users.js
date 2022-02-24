const asyncHandler = require('../middleware/async');
const FollowSchema = require('../models/FollowSchema');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc     Get users
// @route    GET/api/v1/users
// @acces    Public
exports.getUsers = asyncHandler( async(req, res, next) => {
    res.status(200).json(res.advancedResults)
})

// @desc     Get user by id
// @route    GET/api/v1/users
// @acces    Public
exports.getUser = asyncHandler( async(req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorResponse('User does not exist in database', 404));
    }

    res.status(200).json({success: true, user});
    
})

// @desc     Follow user
// @route    PUT/api/v1/users/follow
// @acces    Private
exports.follow = asyncHandler( async(req, res, next) => {

    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorResponse('User does not exist in database', 404));
    }

    if(user._id == req.user.id) {
        return next(new ErrorResponse('Forbidden', 403));
    }
    
    const followerExists = await FollowSchema.find({ $and : [{ 'follower': { $eq : Object(req.user.id) } }, {'following': {$eq : Object(req.params.id) }}]});
    
    if(followerExists!=0) {
        await FollowSchema.findOneAndDelete({ $and : [{ $eq: ['$follower', Object(req.user.id)] }, {$eq: ['$following', Object(req.params.id)]}]})
        res.status(200).json({id: req.user.id, success: true, message: "Unfollowed"})
    }else {
        await FollowSchema.create({follower: Object(req.user.id), following: Object(req.params.id)})
        res.status(200).json({id: req.user.id, success: true, message: "Following"})
    }

});