const mongoose = require('mongoose')

const FollowSchema = new mongoose.Schema({

    follower: {
        type: mongoose.Schema.Types.ObjectId
    },

    following: {
        type: mongoose.Schema.Types.ObjectId
    }

})

module.exports = mongoose.model('FollowSchema', FollowSchema)