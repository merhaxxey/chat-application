const mongoose = require('mongoose')

const ChatSchema = mongoose.Schema({
    you:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    me:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }, 
    youUsername:{
        type: String,
        minlength: 4,
        maxlength: 15,
        required: true
    },
    read:{
        type: Boolean,
        default: true,
        required: false
    },
    unreadCount:{
        type: Number,
        default: 0,
        required: false
    },
    unreadFrom:{
        type: mongoose.Types.ObjectId,
        ref: 'Message',
        required: false  
    },
    lastSender:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: false
    },
    contact:{
        type: mongoose.Types.ObjectId,
        ref: 'Contact',
        required: true
    }
    
}, {timestamps: true, toJSON: {virtuals: true}, toObject:{virtuals: true}})

ChatSchema.virtual('messages', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'chat',
    justOne: false
})

ChatSchema.index({you: 1, me: 1}, {unique: true})

module.exports = mongoose.model('Chat', ChatSchema)