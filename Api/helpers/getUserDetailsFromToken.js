
const jwt = require('jsonwebtoken')
const User = require('../models/user.model.js')

const Jwt_Secret = "jfsaljdfkljaiewoeuroiwnx()n8934729847ankajfjfasdl092130[]]9kjfa"
const getUserDetailsFromToken = async(token)=>{
    if(!token){
        return{
            message:"session out",
            logout : true,
        }
    }

    const decode = await jwt.verify(token, Jwt_Secret)
    // const email = decode.email
    const user  = await User.findById(decode.id)
    //.select('-password')

    return user
}
module.exports = getUserDetailsFromToken
