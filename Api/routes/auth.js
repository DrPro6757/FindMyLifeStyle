// const router = require("express").Router()
// const crypto = require("crypto")
// const nodemailer = require("nodemailer")
// // router.get("/",(req,res)=>{
// //     res.send("hello auth router");
// // })
// const bcrypt = require ("bcrypt");
// const User = require("../models/User");

// // function to send verification email to user
// //  const sendVerificationEmail = async(emailId, verficationToken)=>{
// //     // create a nodemailer transport
// //     const transporter = nodemailer.createTransport({
// //         // configure the email service
// //         service:"gmail",
// //         auth:{user:"thedatadistrict@gmail.com",

// //     }
// //     })
    
// //  }

//  router.get('/aaa', (req,res)=>{
//     res.send("hello user router")
// })

// // Api to register User
//    router.post("/register",async(req,res)=>{
   
//     try {
//         const salt = await bcrypt.genSalt(10)
//         const hashedPassword = await bcrypt.hash(req.body.password,salt);
// // check if the email is already registered
//         // const existingUser = await User.findOne({emailId});
//         // if(existingUser){
//         //     return res.status(400).json({message:"Email already registered"});
//         // }
// // create a new User
//         const newUser = new User({
//             username:req.body.username,
//             emailId:req.body.emailId,
//             // gender:req.body.gender,
//             // dob:req.body.dob,
//             // profilePic:req.body.profilePic,
//             password:hashedPassword,
//         });
//         // generate and store the verification token
//         // newUser.verficationToken = crypto.randomBytes(20).toString("hex");

//         // save the user to the database
//         await newUser.save();
//         res.status(200).json(newUser);

//         // console.log('Register Status ', json(newUser))
//         // send verification email to the user
//         // sendVerificationEmail(newUser.emailId, newUser.verficationToken)
//     } catch (error) {
//         console.log(error);
//         res.status(500).json(error);   
//     }
//    });
// // Api for Login User
// router.post("/login", async(req,res)=>{
//     try {
//         const user = await User.find({emailId:req.body.emailId})
//         !user && 
//         res.status(200).json({status:false,message:'User not found'})
//         if(user){
//             const validPassword = await bcrypt.compare(req.body.password, user.password)
//             if(validPassword){
//                 res.status(200).json({status:true, message:'User Found Scuccessfully', data:user})
//             }else{
//                 res.status(200).json({status:false,message:'Wrong Password'})
//             }
//         }

//     } catch (error) {
//         console.log(error)
//         res.status(500).json(error);   

//     }
// })

//  module.exports = router