const express = require('express')
const router = express.Router()
const {
    createContact,
    getAllUserContact,
    getSingleContact,
    deleteSingleContact
} = require('../controllers/contactController')
const {authenticateUser} = require('../middleware/authentication')

router.route('/').post(authenticateUser, getAllUserContact)
router.route('/create').post(authenticateUser, createContact)
router.route('/single/:id').get(authenticateUser, getSingleContact)
router.route('/delete/:id').delete(authenticateUser, deleteSingleContact)

module.exports = router