const mongoose = require('mongoose')

const MessageSchema = mongoose.Schema({
    messages:{
        format: {
            type: String,
            default: 'text',
        },
        text:{
            type: String,
            required: true
        }
    },
    fileUrl:{
        type: String,
        default: ''
    },
    users: Array,
    sender:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    chat:{
        type: mongoose.Types.ObjectId,
        ref: 'Chat',
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Message', MessageSchema)