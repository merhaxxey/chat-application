require('express-async-errors')
require('dotenv').config()
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2
const cors = require('cors')

const socket = require('socket.io')
const connectDB = require('./db/connect.js')
const authRoutes = require('./routes/authRoutes')
const messageRoutes = require('./routes/messageRoutes')
const userRoutes = require('./routes/userRoutes')
const contactRoutes = require('./routes/contactRoutes')
const chatRoutes = require('./routes/chatRoutes')

const notFoundError = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))

app.use(fileUpload({useTempFiles: true}))
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

app.use(notFoundError)
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 5000

const start = async()=>{
    try{
        await connectDB(process.env.MONGO_URL)
        console.log('db active')
    }catch(error){
        console.log(error)
    }
}
start()

const server = app.listen(5000, ()=>{
    console.log(`Server listeinig on port ${PORT}`)
})

const io = socket(server, {
    cors:{
        origin: 'http://localhost:3000',
        credentials: true 
    }
})

global.onlineUsers = new Map()

io.on('connection', (socket)=>{
    socket.on('add-users', (userId)=>{
        onlineUsers.set(userId, socket.id)
        onlineUsers.set(socket.id, userId)
        console.log(onlineUsers)
        io.to(socket.id).emit('load-msgs', {userId})
    })
    socket.on('add-to-contact', ({contact})=>{
        const socketId = onlineUsers.get(contact.you)
        if(socketId){
            socket.to(socketId).emit('add-to-contact', contact)
        }
    })
    socket.on('add-to-chat', (userId)=>{
        const socketId = onlineUsers.get(userId)
        console.log(socketId)
        socket.to(socketId).emit('add-to-chat')
    })
    socket.on('send-msg', ({userId, msg})=>{
        const socketId = onlineUsers.get(userId)
        socket.to(socketId).emit('send-msg', msg)
    })
})