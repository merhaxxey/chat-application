const express = require('express')
const router = express.Router()
const {
    addMessage,
    getAllMessage,
    uploadFile
} = require('../controllers/messageController')
const {authenticateUser} = require('../middleware/authentication')
// const aws = require('aws-sdk')
// const multer = require('multer')
// const multers3 = require('multer-s3')


// aws.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.REGION
// })

// const s3 = new aws.S3()
// const upload = multer({
//     storage:multers3({
//         bucket: process.env.BUCKET,
//         s3: s3,
//         acl: 'public-read',
//         key: (req, file, cb)=>{
//             cb(null, file.originalname)
//         }
//     })
// })

router.route('/add').post(authenticateUser, addMessage)
router.route('/all').post(authenticateUser, getAllMessage)
router.route('/uploadFile').post(authenticateUser, uploadFile)

module.exports = router