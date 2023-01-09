const mongoose = require('mongoose')

const ContactSchema = mongoose.Schema({
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
    }
}, {timestamps: true})

ContactSchema.index({you: 1, me: 1}, {unique: true})

module.exports = mongoose.model('Contact', ContactSchema)