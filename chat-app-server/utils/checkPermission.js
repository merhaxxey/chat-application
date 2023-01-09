const CustomError = require('../errors')
const checkPermission = (requestUser, userId)=>{
    if(requestUser.userId === userId.toString()) return
    if(requestUser.role === 'admin') return

    throw new CustomError.UnauthorizedError('Authorization invalid')
}
module.exports = {checkPermission}