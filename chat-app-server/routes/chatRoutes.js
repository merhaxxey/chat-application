const express = require('express')
const router = express.Router()
const chat = require('../controllers/chatController')
const {
    createChat,
    getAllChat,
    getSingleChat,
    updateChat,
    deleteChat
} = require('../controllers/chatController')
const {authenticateUser} = require('../middleware/authentication')

router.route('/all').post(authenticateUser, getAllChat)
router.route('/create').post(authenticateUser, createChat)
router.route('/single/:id').get(authenticateUser, getSingleChat)
router.route('/update/:id').patch(authenticateUser, updateChat)
router.route('/delete/:id').delete(authenticateUser, deleteChat)

module.exports = router