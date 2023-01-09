const CustomAPIError = require('./custom-api')
const {StatusCodes} = require('http-status-codes')

class NotFound extends CustomAPIError{
    constructor(message){
        super(message, StatusCodes.NOT_FOUND)
    }
}
module.exports = NotFound