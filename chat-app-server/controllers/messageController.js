const fs = require('fs')
const cloudinary = require('cloudinary').v2
const Message = require('../model/Message')
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes')
const Chat = require('../model/Chat')

const uploadFile = async(req, res)=>{
    const file = req.files
    console.log(file)
    if(!file){
        throw new CustomError.BadRequestError('Nothing was uploaded')
    }
    const uploadedFile = file.file
    const {tempFilePath, name} = uploadedFile
    maxSize = 1024 * 1024 *300
    if(uploadedFile.size > maxSize){
        throw new CustomError.BadRequestError('Please upload a file less than 300 mb')
    }

    const oldFilename = tempFilePath.split('\\')
    oldFilename[oldFilename.length-1] = name
    const newFilename = oldFilename.join('\\')

    fs.renameSync(tempFilePath, newFilename)

    const result = await cloudinary.uploader.upload(newFilename, {
        use_filename: false,
        folder: 'chat-app-images/profileImages'
    })
    fs.unlinkSync(newFilename)

    res.status(StatusCodes.OK).json({url: result.secure_url})
}

const addMessage = async(req, res)=>{
    const {to, message, chatId, fileUrl} = req.body
    const from = req.user.userId
    console.log(message)
    const msg = await Message.create({
        messages: message,
        users:[from, to],
        sender: from,
        chat : chatId,
        fileUrl
    })

    let chat = await Chat.findOne({_id: chatId})
    chat.read = false
    chat.unreadCount = chat.unreadCount + 1
    chat.unreadFrom = msg._id
    chat.lastSender = from
    chat = await chat.save()

    res.status(StatusCodes.CREATED).json({message: msg})
}

const getAllMessage = async(req, res)=>{
    const {id, to, from, markAsRead, curChatId} = req.body
    
    const messages = await Message.find({users: {$all: [from, to]}}).sort({
        updatedAt: 1
    })
    
    const projectMessages = messages.map((msg, index)=>{
        return {
            fromSelf: msg.sender.toString() === req.user.userId,
            format: msg.messages.format,
            message: msg.messages.text,
            updatedAt: msg.updatedAt,
            chat: msg.chat
        }
    })
    
    // mark messages under as read
    let chat = []
    if(markAsRead){
        chat = await Chat.findOneAndUpdate({_id: curChatId}, {read: true, unreadCount: 0}, {
            new: true,
            runValidators: true
        })
        .populate({
            path: 'you',
            select: '_id username status profileImage updatedAt'
        })
        .populate({
            path: 'me',
            select: '_id username status profileImage updatedAt'
        })
    }

    
    const allChat = await Chat.find({$or: [{me:id}, {you:id}]})
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


    res.status(StatusCodes.OK).json({count:projectMessages.length, message:projectMessages, chat, allChat})
}

module.exports = {
    addMessage,
    getAllMessage,
    uploadFile
}