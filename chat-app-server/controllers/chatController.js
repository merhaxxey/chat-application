const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes')
const Chat = require('../model/Chat')

const createChat = async(req, res)=>{
    const {contactId, you, youUsername} = req.body
    const me  = req.user.userId

    
    let chat = await Chat.findOne({contact: contactId})
    .populate({
        path: 'you',
        select: '_id username status profileImage updatedAt'
    })
    .populate({
        path: 'me',
        select: '_id username status profileImage updatedAt'
    })
    if(!chat){
        data = await Chat.create({
            you,
            me,
            youUsername,
            contact: contactId
        })
        if(data){
            chat = await Chat.findOne({contact: data.contact})
            .populate({
                path: 'you',
                select: '_id username status profileImage updatedAt'
            })
            .populate({
                path: 'me',
                select: '_id username status profileImage updatedAt'
            })
        }
    }
    console.log(chat)
    res.status(StatusCodes.CREATED).json({chat})
}
const getAllChat = async(req, res)=>{
    const {id}  = req.body
    console.log(id)
    const chat = await Chat.find({$or: [{me:id}, {you:id}]})
    .sort({
        updatedAt: -1
    })
    .populate({
        path: 'you',
        select: '_id username status profileImage updatedAt'
    })
    .populate({
        path: 'me',
        select: '_id username status profileImage updatedAt'
    })

    res.status(StatusCodes.OK).json({count: chat.length, chat})
}
const getSingleChat = async(req, res)=>{
    const me  = req.user.userId
    const you = req.params.id

    const chat = await Chat.findOne({me, you})
    if(!chat){
        throw new CustomError.NotFoundError('chat doest not exist')
    }
    res.status(StatusCodes.OK).json({chat})
}
const updateChat = async(req, res)=>{
    const {id} = req.params

    const chat = await Chat.findOneAndUpdate({_id: id}, req.body, {
        new: true,
        runValidators: true
    })
    if(!chat){
        throw new CustomError.UnauthenticatedError('Unable to update chat, please check your credentials')
    }
    res.status(StatusCodes.OK).json({chat})
}
const deleteChat = async(req, res)=>{
    const me  = req.user.userId
    const you = req.params.id

    const chat = await Chat.findOneAndDelete({me, you})
    if(!chat){
        throw new CustomError.NotFoundError('chat doest not exist')
    }

    res.status(StatusCodes.OK).json({chat})

}

module.exports = {
    createChat,
    getAllChat,
    getSingleChat,
    updateChat,
    deleteChat
}