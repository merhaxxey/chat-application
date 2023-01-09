const express = require('express')
const router = express.Router()
const {
    getCurrentUser,
    getAllUser,
    getSingleUser,
    uploadImage,
    updateUser
} = require('../controllers/userController')
const {authenticateUser, authorizePermission} = require('../middleware/authentication')
 
router.route('/all').get(authenticateUser, getAllUser)
router.route('/update').patch(authenticateUser, updateUser)
router.route('/showMe').get(authenticateUser, getCurrentUser)
router.route('/uploadImage').post(authenticateUser, uploadImage)
router.route('/:id').get(authenticateUser, getSingleUser)

module.exports = router