// const User = require('../models/user.model');
const User = require('../models/user.model.js');
const verificationToken = require('../models/UserVerification.model.js');
const {generateOTP} = require('../utils/mail.js');
const jwt = require('jsonwebtoken');
const Jwt_Secret =
  'jfsaljdfkljaiewoeuroiwnx()n8934729847ankajfjfasdl092130[]]9kjfa';
const bcrypt = require('bcrypt');
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken.js');
const nodemailer = require('nodemailer');
const OTPGenerator = require('otp-generator');
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
const sendOTPEmail = async (OTP, TO) => {
  // let testAccount  = await nodemailer.createTestAccount();
  // connect with the smtp server
  // const server = http.createServer((request, reponse)=>{
  // let transporter  = nodemailer.transport({
  const auth = await nodemailer.createTransport({
    // host: account.smtp.host,
    service: 'gmail',
    port: 465, //account.smtp.port
    secure: true, //account.smtp.secure
    auth: {
      user: 'thedatadistrict@gmail.com',
      pass: 'lmep bmwj vjcz svrd',
    },
  });
  //lmep bmwj vjcz svrd

  const receiver = {
    from: 'thedatadistrict@gmail.com',
    to: TO, //
    subject: 'Verfication Code FML',
    text: OTP, //'123456'
  };
  auth.sendMail(receiver, (error, emailResponse) => {
    if (error) throw error;
    console.log('success!');
    res.end();
  });
  // })

  // server.listen(8000)
  // console.log("Message sent : %s", info.messageId)
  // res.json(info)
};

const RegisterUser = async (req, res) => {
  try {
    const {name, email, password, gender} = req.body;
    const emailCheck = await User.findOne({email});
    if (emailCheck) {
      return res
        .status(200)
        .json({status: 'ok', message: 'User Already Exist'});
    }
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const payload = {
      name,
      email,
      password: hashedPassword,
      gender,
    };
    const user = new User(payload);
    const userSave = await user.save();

    return res.status(201).json({
      message: 'User created successfully',
      data: userSave,
      success: true,
    });
    //later
    // const newuser = await User.create(req.body);
    // res.status(200).json(newuser);

    // const verficationToken = new verificationToken({
    //     owner: user._id,
    //     token: otp
    // })
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};
const SaveEmailWithOTP = async (req, res) => {
  try {
    // const {signUpType, email, OTP, verifiedEmail} = req.body;
    // const OTPCode = '123456';

    const {email} = req.body;

    const emailCheck = await User.findOne({email});
    if (emailCheck) {
      // return
      res.status(200).json({
        status: 'ok',
        message: 'User Exist',
        data: emailCheck,
        success: true,
      });
    }
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
    // if (signUpType === 'email') {
    //later
    // const payload = {
    //   signUpType,
    //   email,
    //   OTP: OTPCode,
    //   verifiedEmail: true,
    // };
    // const user = new User(payload);
    // const userSave = await user.save();
    // const TO = `${email}`;
    // //later
    // sendOTPEmail(OTPCode, TO);
    // return res.status(201).json({
    //   message: 'User created successfully',
    //   data: userSave,
    //   success: true,
    // });
    //later
    // }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};
const LoginUserWithOTP = async () => {
  const {id} = req.params;
  const signUpType = req.body.signUpType;
  const OTP = req.body.OTP;
  let user;
  if (signUpType == 'email') {
    user = await User.findOne({email});
  } else {
    user = await User.findOne({phone});
  }
  if (user.OTP == req.body.OTP) {
    const user = await User.findByIdAndUpdate(id, req.body);
    if (!user) {
      return res.status(404).json({message: 'Comment not found'});
    }
    const updatedUser = await User.findById(id);
    res.status(200).json(UpdateUser);
  }
};

const getMyDataApi = async (req, res) => {
  const {id} = req.params;
  const user = await User.findById(id);
  !user &&
    res.status(200).json({
      status: false,
      message: 'user not found',
    });

  if (user) {
    res.status(200).json(user);
  }
};

const LoginUser = async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    !user &&
      res.status(200).json({
        status: false,
        message: 'user not found',
      });

    if (user) {
      // const verifyPassword = await comparePassword(password, user.password)
      // bcrypt.compare(hashedPassword, user.password, function (err, result) {
      //     if (err) {
      //       throw err;
      //     }
      //     // console.log(result);
      //     if (!result) {
      //       return res.status(201).json({ message: "Wrong password!" });
      //     } else {
      //       return res.status(201).json({ message: "Connected!" });
      //     }
      //   });

      // const isMatched = await comparePassword(password, user.password)
      // if (password == user.password) {
      //     if(verifyPassword ){
      ///
      /// final comments to send mail
      ///
      // sendMail()
      const tokenData = {
        id: user._id,
        // email : user.email
      };
      const token = jwt.sign(tokenData, Jwt_Secret, {
        expiresIn: '1d',
      });

      const cookieOption = {
        http: true,
        secure: true,
      };
      return res.status(200).json({
        status: 'ok',
        message: 'Token saved successfully ',
        data: user._id,
      });
      ////
      ///
      ///

      //   return res.status(200).cookie('token', token, cookieOption).json({ status: "ok", message: "Token saved successfully ", data: token })

      //   cookie('token', token, cookieOption).
      // } else {
      //     res.status(200).json({ status: false, message: "Wrong Password" })
      // }
    }
    // && res.status(200).json({status:true, message:"User found successfully ", data:user})
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const UserDetail = async (req, res) => {
  try {
    const token = req.cookies.token || '';
    // const {token} = req.body
    const user = await getUserDetailsFromToken(token);
    // const decode = await jwt.verify(token, Jwt_Secret)
    // const useremail = decode.email
    // User.findOne({email:useremail}).then(data=>{
    // if(!token){
    //     return{
    //         message:"session out",
    //         logout : true,
    //     }
    // }
    return res.status(200).json(user);
    //  return res.status(200).json({
    //      message: "user details",
    //      data : user,
    //     });
    // })
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const Logout = async (req, res) => {
  try {
    const cookieOption = {
      http: true,
      secure: true,
    };
    return res.cookie('token', '', cookieOption).status(200).json({
      message: 'user details',
      success: true,
    });
    // })
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

const UpdateUser = async (req, res) => {
  try {
    // const token = req.cookies.token || '';
    // const userData = await getUserDetailsFromToken(token);
    const {id} = req.params;

    const user = await User.findByIdAndUpdate(id, req.body); // userData.id
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }
    const updatedUser = await User.findById(id);
    res.status(200).json(updatedUser);
    // })
  } catch (error) {
    res.status(500).json({message: error.message});
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
  UserDetail,
  LoginUserWithOTP,
  Logout,
  UpdateUser,
  SaveEmailWithOTP,
  getMyDataApi,
  // updateUser,
  // deleteUser
};
