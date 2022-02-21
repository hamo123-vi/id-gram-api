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
    ]

})

module.exports = mongoose.model('Post', PostSchema)