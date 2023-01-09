const CustomError = require('../errors')
const Token = require('../model/Token')
const { isTokenValid, attachCookiesToResponse, createToken } = require("../utils")

const authenticateUser = async(req, res, next)=>{
    const {accessToken, refreshToken} = req.signedCookies
    try{
        if(accessToken){
            const {user} = isTokenValid(accessToken)
            req.user = user
            return next()
        }
        if(!refreshToken){
            throw new CustomError.BadRequestError('invalid credentials')
        }
    
        const payload = isTokenValid(refreshToken)
        let existingToken = await Token.findOne({user: payload.user.userId})
        
        if(!existingToken || !existingToken.isValid){
            throw new CustomError.UnauthenticatedError('invalid credentials')
        }
        req.user = payload.user
        attachCookiesToResponse({res, user:payload.user, refreshToken: existingToken.refreshToken})
        next()
    }
    catch(error){
        console.log(error)
        throw new CustomError.UnauthenticatedError('Authentication is invalid')        
    }
}

const authorizePermission = (...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            throw new CustomError.UnauthorizedError('Unauthorized access')
        }
        next()
    }
}

module.exports = {
    authenticateUser,
    authorizePermission
}