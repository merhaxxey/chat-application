const mongoose = require('mongoose')

const TokenSchema = mongoose.Schema({
    refreshToken:{
        type: String,
        required: true
    },
    ip:{
        type: String,
        required: true,
    },
    userAgent:{
        type: String,
        required: true
    },
    isValid:{
        type: Boolean,
        default: false
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Token', TokenSchema)
