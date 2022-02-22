const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({

    image: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    likes: [
        {user: {
            type: mongoose.Schema.ObjectId
        }}
    ],

    comments: [
        {
            text: {
                type: String
            },

            user: {
                type: mongoose.Schema.ObjectId
            }
        }
    ],

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }

})

module.exports = mongoose.model('Post', PostSchema)