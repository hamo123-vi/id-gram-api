const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const advancedResults = require('../middleware/advancedResults');
const ErrorResponse = require('../utils/errorResponse');

// @desc     Follow user
// @route    PUT/api/v1/follow
// @acces    Public
exports.follow = asyncHandler( async(req, res, next) => {
    const user = await User.findById(req.params.id);
    const follower = {user: req.user.id}
    if(!user) {
        return next(new ErrorResponse('User does not exist in database', 404));
    }

    if(user._id == req.user.id) {
        return next(new ErrorResponse('Forbidden', 403));
    }
        console.log(req.params.id);
        console.log(req.user.id)
    if(user.followers.includes(follower)) {
        user.followers.pull(follower);
        await user.save();
        res.status(200).json({success: true, message: 'Unfollowed'})
    } else {
        user.followers.push(follower)
        await user.save();
        res.status(200).json(follower)
    }
});