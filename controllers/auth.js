const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc     Register user
// @route    POST/api/v1/auth/register
// @acces    Public
exports.register = asyncHandler( async(req, res, next) => {
    const user =  await User.create(req.body);
    
    //Send token inside cookie
    sendTokenResponse(user, 200, res);
});

// @desc     Login user
// @route    POST/api/v1/auth/login
// @acces    Public
exports.login = asyncHandler( async(req, res, next) => {
    const {email, password} = req.body;

    //Check for credentials
    if(!email || !password) {
        return next( new ErrorResponse('Please provide email and password'));
    }

    //Check for user
    const user = await User.findOne({email}).select('+password');
    if(!user) {
        return next(
            new ErrorResponse('Invalid credentials', 401)
        )
    }

    //CHecking password
    const isMatch = await user.matchPassword(password);
    if(!isMatch) {
        return next(
            new ErrorResponse('Invalid credentials', 401)
        )
    }

    //Send token inside cookie
    sendTokenResponse(user, 200, res);
});

//desc       Get Logged in user
//route      GET/api/v1/auth/me
//access     Private

exports.getMe = asyncHandler( async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user
    })
});

//desc       Update User Details
//route      PUT /api/v1/auth/updatedetails
//access     Private
exports.updateDetails = asyncHandler(async(req, res, next) => {

    const file = req.files.image;

    if (!file) {
      return next(new ErrorResponse("Please upload image", 400))
    }

    file.mv(`${process.env.PROFILE_PICTURE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err) {
            return next(
                new ErrorResponse('Problem with image upload', 500)
            )
        } else {
            const fieldsToUpdate = { 
            fullname: req.body.fullname,
            username: req.body.username,
            email: req.body.email,
            image: file.name
            }

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate); 

        res.status(200).json({success: true, data: fieldsToUpdate});
        }
    });
});


//Token generating
const sendTokenResponse = (user, statusCode, res) => {

    //Create token
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE *24 * 60 * 60 * 1000),
        httpOnly: true
    }

    res
    .status(statusCode)
    .json({success: true, token});
}