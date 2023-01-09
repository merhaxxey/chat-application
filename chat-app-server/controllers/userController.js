const fs = require('fs')
const { StatusCodes } = require('http-status-codes')
const User = require('../model/User')
const CustomError = require('../errors')
const cloudinary = require('cloudinary').v2
const { checkPermission } = require('../utils/checkPermission')
const Contact = require('../model/Contact')

const getCurrentUser = async(req, res)=>{
    console.log('hey up')
    const user = await User.findOne({_id: req.user.userId}).select('-password')
    res.status(StatusCodes.OK).json({user})
}
const getAllUser = async(req, res)=>{
    let users = []
    let existContact
    for await (doc of User.find({_id: {$ne: req.user.userId}}).sort({
        username: 1
    })){
        existContact = await Contact.findOne({$or: [{me: req.user.userId, you: doc._doc._id}, {me: doc._doc._id, you: req.user.userId}]})
        if(existContact){
            const user = doc._doc
            user.added = true
            users = [...users, user]
        }
        else{
            const user = doc._doc
            user.added = false
            users = [...users, user]
        }
    }

    res.status(StatusCodes.OK).json({count: users.length, user:users})
}
const getSingleUser = async(req, res)=>{ 
    const user = await User.findOne({_id: req.params.id}).select('-password')
    
    checkPermission(req.user, user._id)
    res.status(StatusCodes.OK).json({user})
}
const updateUser = async(req, res)=>{
    const user = await User.findOneAndUpdate({_id:req.user.userId}, req.body, {
        new: true,
        runValidators: true
    })
    checkPermission(req.user, user._id)

    res.status(StatusCodes.OK).json({user})
}
const uploadImage = async(req, res)=>{
    if(!req.files){
        throw new CustomError.NotFoundError('no image uploaded')
    }
    const {mimetype, tempFilePath} = req.files.image
    if(!mimetype.startsWith('image')){
        throw new CustomError.BadRequestError('No image was uploaded')
    }

    const result = await cloudinary.uploader.upload(tempFilePath, {
        use_filename: true,
        folder: 'chat-app-images/profileImages'
    })
    const user = await User.findOneAndUpdate({_id: req.user.userId}, {profileImage: result.secure_url}, {
        new: true,
        runValidator: true
    })

    checkPermission(req.user, user._id)

    fs.unlinkSync(tempFilePath)
    res.status(StatusCodes.OK).json({image:{src: result.secure_url}})
}
module.exports = {
    getCurrentUser,
    getAllUser,
    getSingleUser,
    uploadImage,
    updateUser
}