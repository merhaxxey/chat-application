const CustomError = require('../errors')
const Contact = require('../model/Contact')
const User = require('../model/User')
const { StatusCodes } = require("http-status-codes")

const createContact = async(req, res)=>{
    const {youId, username} = req.body
    if(!youId){
        throw new CustomError.BadRequestError('Invalid credentials')
    }

    const existsContact = await Contact.findOne({$or: [{you: youId, me:req.user.userId}, {me: youId, you:req.user.userId}]})
    if(existsContact){
        throw new CustomError.BadRequestError('contact already exist')
    }
    const contact = await Contact.create({you: youId, me:req.user.userId, youUsername: username})

    // get all people
    let users = []
    let existContact
    for await (doc of User.find({_id: {$ne: req.user.userId}}).sort({
        username: 1
    })){
        existContact = await Contact.findOne({me: req.user.userId, you: doc._doc._id})
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

    res.status(StatusCodes.CREATED).json({contact, people:users})
}

const getAllUserContact = async(req, res)=>{
    const contact = await Contact.find({$or: [{me: req.user.userId}, {you: req.user.userId}]})
    .populate({
        path: 'you',
        select: 'profileImage username updatedAt status _id'
    })
    .populate({
        path: 'me',
        select: 'profileImage username updatedAt status _id'
    })
    .sort({
        youUsername: 1
    })

    res.status(StatusCodes.OK).json({count: contact.length, contact})
}
const getSingleContact = async(req, res)=>{
    const youId = req.params.id
    if(!youId){
        throw new CustomError.BadRequestError('Invalid credentials')
    }
    const contact = await Contact.findOne({me: req.user.userId, you: youId})
    .populate({
        path: 'you',
        select: 'profileImage username updatedAt'
    })
    .populate({
        path: 'me',
        select: 'profileImage username updatedAt'
    })

    res.status(StatusCodes.OK).json({count: contact.length, contact})
}
const deleteSingleContact = async(req, res)=>{
    const contact = await Contact.findOneAndDelete({you: req.params.id, me: req.user.userId})
    res.status(StatusCodes.OK).json({msg:'contact deleted successfully'})
}

module.exports = {
    createContact,
    getAllUserContact,
    getSingleContact,
    deleteSingleContact
}