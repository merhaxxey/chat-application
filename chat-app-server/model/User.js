const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = mongoose.Schema({
    name:{
        type: String,
        minlength: 3,
        maxlength: 150,
        required: true
    },
    username:{
        type: String,
        minlength: 4,
        maxlength: 15,
        required: true
    },
    password: {
        type: String,
        minlength: 7,
        required: true
    },
    profileImage: {
        type: String,
        required: false
    },
    role: {
        type: String,
        required: true
    },
    lastOnline:{
        type: Date,
        required: false
    },
    status:{
        type: String,
        default: 'Hey up, i am using reca',
        required: false
    }

}, {timestamps: true})

UserSchema.pre('save', async function(){
    console.log('hjvbh')
    if(this.isModified('password')){
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    }
})
UserSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password)
}
module.exports = mongoose.model('User', UserSchema)