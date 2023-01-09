const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const User = require('../model/User')
const crypto = require('crypto')
const { Agent } = require('http')
const createToken = require('../utils/createToken')
const Token = require('../model/Token')
const { attachCookiesToResponse } = require('../utils')

const register = async(req, res)=>{
    const {name, username, password} =  req.body
    if(!name || !username || !password){
        throw new CustomError.BadRequestError('invalid creadentials')
    }
    const role = (await User.countDocuments()) === 0? 'admin': 'user'
    
    // await User.deleteMany({})
    const usernameExists = await User.findOne({username})
    if(usernameExists){
        throw new CustomError.NotFoundError('Username is already taken')
    }

    const user = await User.create({name, username, password, role})

    let refreshToken = ''
    refreshToken = crypto.randomBytes(40).toString('hex')
    const ip = req.ip
    const userAgent = req.get('user-agent')
    const tokenUser = createToken(user)

    const token = await Token.create({refreshToken, ip, userAgent, isValid: true, user:user._id})
    attachCookiesToResponse({res, user:tokenUser, refreshToken:token.refreshToken})   
    
    delete user.password
    
    res.status(StatusCodes.CREATED).json({user})
}
const login = async(req, res)=>{
    const {username, password} = req.body
    if(!username || !password){
        throw new CustomError.BadRequestError('invalid credentials')
    }
    
    const user = await User.findOne({username})
    if(!user){
        throw new CustomError.NotFoundError('Invalid username or password')
    }

    const existsPassword = await user.comparePassword(password)
    if(!existsPassword){
        throw new CustomError.NotFoundError('Invalid username or password')
    }

    const existingToken = await Token.findOne({user: user._id})
    let refreshToken = ''
    if(existingToken){
        if(!existingToken.isValid){
            throw new CustomError.UnauthenticatedError('invalid credentials')
        }
        refreshToken = existingToken.refreshToken
        const tokenUser = createToken(user)
        attachCookiesToResponse({res, user: tokenUser, refreshToken})
        
        delete user.password
        res.status(StatusCodes.OK).json({user})
        return
    }
    refreshToken = crypto.randomBytes(40).toString('hex')
    const ip = req.ip
    const userAgent = req.get('user-agent')
    const tokenUser = createToken(user)
    
    const token = await Token.create({refreshToken, ip, userAgent, isValid: true, user:user._id})
    attachCookiesToResponse({res, user:tokenUser, refreshToken:token.refreshToken})   
    
    delete user.password
    
    res.status(StatusCodes.OK).json({user})
}

const logout = async(req, res)=>{
    res.cookie('accessToken', '', {
        maxAge: 0
    })
    res.cookie('refreshToken', '', {
        maxAge: 0
    })
    res.status(StatusCodes.OK).json({msg: 'user logged out'})
}

module.exports = {register, login, logout}