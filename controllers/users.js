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
        const followerExists = await User.find({ $and : [{ followers : { $elemMatch: { user: {$eq: Object(req.user.id) } } } }, {_id: req.params.id}]});

        if(followerExists.length>0) {
            await user.updateOne({ $pull: { followers: follower} });
            await user.save();
            res.status(200).json({success: true, message: "Unfollowed"})
        }else {
            await user.updateOne({ $push: { followers: follower} });
            await user.save();
            res.status(200).json({success: true, message: "Following"})
    }

});