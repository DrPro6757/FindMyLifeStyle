// const User = require('../models/user.model');
const User = require('../models/user.model.js')
const verificationToken = require('../models/UserVerification.model.js')
// const { generateOTP } = require('../utils/mail.js')
const jwt = require('jsonwebtoken')
const Jwt_Secret = "jfsaljdfkljaiewoeuroiwnx()n8934729847ankajfjfasdl092130[]]9kjfa"
const bcrypt = require("bcrypt")
// const getUsers = async(req,res)=>{
//     try {
//         const users = await User.find({});
//         res.status(200).json(users);
//        } catch (error) {
//         res.status(500).json({message:error.message});
//        }
// }

// const getUser = async(req,res)=>{
//     try {
//         const {id} = req.params;
//         const user = await User.findById(id);
//         res.status(200).json(user);
//        } catch (error) {
//         res.status(500).json({message:error.message});
//        }
// }

const RegisterUser = async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if (user) return res.status(200).json({status:'ok',message: 'User Already Exist' });
        // const newUser = new User({
        //     email,
        //     password,
        // })
        // newUser.save()
        // res.send(newUser)

        
        // const OTP = generateOTP()
        // console.log('otp generated = ', OTP)
        // const verficaitonToken = new verficaitonToken ({
        //     owner: _id,
        //     token: OTP,
        // })

        // const token = await verificationToken.create(verficaitonToken);

        const newuser = await User.create(req.body);
        res.status(200).json(newuser);

        // const verficationToken = new verificationToken({
        //     owner: user._id,
        //     token: otp
        // })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



const LoginUser = async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({ email })
        !user && res.status(200).json({ status: false, message: "user not found" });
        if (user) {
            const isMatched = await comparePassword(password, user.password)
            // if (password == user.password) {
                if(isMatched ){
                const token = jwt.sign({email:user.email}, Jwt_Secret,{
                    expiresIn:'1d'
                })
                res.status(200).json({ status: "ok", message: "Token saved successfully ", data: token })
            } else {
                res.status(200).json({ status: false, message: "Wrong Password" })
            }
        }
        // && res.status(200).json({status:true, message:"User found successfully ", data:user})
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const UserData = async (req, res) => {
    const {token} = req.body
    try {
        const user = jwt.verify(token,Jwt_Secret)
        const useremail = user.email
        User.findOne({email:useremail}).then(data=>{
            return res.send({status:"ok",data:data})
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// async(req,res)=>{
//     try {
//         const user = await User.create(req.body);
//         res.status(200).json(user);
//        } catch (error) {
//         res.status(500).json({message:error.message});
//        }
// }

// const updateUser = async(req,res)=>{
//     try {
//         const {id} = req.params;
//         const user = await User.findByIdAndUpdate(id, req.body);
//         if(!user){
//            return res.status(404).json({message:"User not found"})
//         }
//         const updatedUser = await User.findById(id);
//         res.status(200).json(updatedUser);
//        } catch (error) {
//         res.status(500).json({message:error.message});
//        }
// }

// const deleteUser = async(req,res)=>{
//     try {
//         const {id} = req.params;
//         const user = await User.findByIdAndDelete(id);
//         if(!user){
//            return res.status(404).json({message:"User not found"})
//         }
//         res.status(200).json({message:'Product deleted successfully'});
//        } catch (error) {
//         res.status(500).json({message:error.message});
//        }
// }

module.exports = {
    // getUsers,
    // getUser,
    RegisterUser,
    LoginUser,
    UserData,
    // updateUser,
    // deleteUser
}
