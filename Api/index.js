const express = require('express');
const nodemon = require('nodemon');
const cors = require('cors');
const connectDB = require('./config/connectDB.js');
// const { appi, server } = require('./socket/index.js')
const {Server} = require('socket.io');
const http = require('http');
const {ExpressPeerServer} = require('peer');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cookieSession = require('cookie-session');
const nodemailer = require('nodemailer');
// const router = require("express").Router()
const userRouter = require('./routes/user.route');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passportSetup = require('./passport');
const User = require('./models/user.model.js');
const userVerification = require('./models/UserVerification.model.js');
const EventPostData = require('./models/PostEvent.model.js');
const LiveStreamData = require('./models/LiveUser.model.js');

const UserPostData = require('./models/PostUser.model.js');
const {
  ConversationModel,
  MessageModel,
} = require('./models/Conversation.model.js');
const Conversation = require('./models/ConversationNew.model.js');
const Message = require('./models/Message.model.js');
const EventCommentData = require('./models/PostEventComments.model.js');
const UserCommentData = require('./models/PostUserComments.model.js');
const PostReelData = require('./models/PostReeels.model.js');
const ReelCommentData = require('./models/ReelComment.model.js');
const getConversation = require('./helpers/getConversation.js');
// const userRoute = require('./routes/user.route.js');
const authRoute = require('./routes/auth.js');
const upload = require('../Api/middleware/upload.js');
const getUserDetailsFromToken = require('./helpers/getUserDetailsFromToken.js');

const dotenv = require('dotenv').config();

const Jwt_Secret =
  'jfsaljdfkljaiewoeuroiwnx()n8934729847ankajfjfasdl092130[]]9kjfa';

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://findmylifestyle.onrender.com', //process.env.FRONT_END,http://localhost:8000
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
const customGenerationFunction = () =>
  (Math.random().toString(36) + '00000000000000000000').substr(2, 16);

/// commented while editing design
// const peerServer = ExpressPeerServer(server,{
//     debug : true,
//     path : '/',
//     generateClientId:customGenerationFunction,
// })
// app.use("/mypeer", peerServer)
///
//
//
// let users = []

// const addUser = (userData, socketId) =>{
//     !users.some(user => user.sub  == userData.sub)&& users.push({...userData, socketId})
// }
// const getuser = (userId) =>{
//     return users.find(user => user.sub === userId);
// }

/// On socket connected main function
const onlineUser = new Set();
let myUserId = '';
// user socket map  for storing online and connected user
const userSocketMap = {}; // this map store corresponding user id ; userId -> socketId

const getReceiverSocketId = receiverId => userSocketMap[receiverId];

io.on('connection', async socket => {
  console.log(' connnect user socket with socket id', socket.id); //socket.id

  const userId = socket.handshake.query.userId;
  console.log('hand shake user id ', userId);
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(
      `User connected : userId => ${userId}, socketId => ${socket.id}`,
    );
  }
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  console.log(' connnect user socket with socket id', socket.id); //socket.id
  socket.emit('me', socket.id);

  // for calling with redux
  socket.on('join-room', ({roomID, userIdd}) => {
    socket.join(roomID);
    socket.to(roomID).broadcast.emit('user-connected', userIdd);
  });

  // console.log(' socket id = ', socket.id)//socket.id

  // socket.on("chat message", (msg) => { //,room
  //     console.log(msg);
  //     io.emit("receive message", msg)
  //     // socket.broadcast.emit("receive message", msg)
  //     // io.to(room).emit("receive message", msg)
  // })
  // socket.emit("welcome",`welcome from server ${socket.id}`)
  // socket.on("addUsers", userData =>{
  //     addUser(userData, socket.id)
  //     io.emit("getUsers", users)
  // })
  // or we can user Id by running the API
  // current user infor
  // const userIdForData = socket.handshake.auth.token
  // const user = await getUserDetails(userIdForData)
  // console.log('current user detail', user)

  /// For Chatting With Socket Commented Later For Call Implementation
  // socket.on("userId", (userId) => { //,room
  //     console.log('My user id',userId);
  //     myUserId = userId._id
  //     socket.join(myUserId)
  //     onlineUser.add(myUserId)
  //     io.emit('onlineUser', Array.from(onlineUser))//io.emit
  // })
  // socket.on("sendReceiverData", async(receiverId)=>{
  //     console.log('receiver id socekt', receiverId)
  //     const userDetail = await User.findById(receiverId).select("-password")
  //     const payload = {
  //         _id:userDetail?._id,
  //         name:userDetail?.name,
  //         email:userDetail?.email,
  //         profilePic:userDetail?.profilePic,
  //         onlineStatus:onlineUser.has(receiverId)
  //     }
  //     socket.emit('messageUser', payload)

  //     // get previous message
  //     const getConversationMessage = await ConversationModel.findOne(
  //         {
  //             $or:
  //             [
  //                 {conversationId:myUserId+receiverId},
  //                 {conversationId:receiverId+myUserId}
  //             ]
  //         }
  //         ).populate('messages').sort({updatedAt : -1})
  //     // console.log('getConversation', getConversationMessage)

  // socket.emit('message', getConversationMessage?.messages || [])
  // // io.to(data?.receiver).emit('message', getConversationMessage.messages)

  //     })
  //     // new message
  // socket.on('new message', async(data)=>{
  //     // check conversation is available both user
  //     // const conversation = await ConversationModel.find({
  //     //         $or:[
  //     //             {sender:data?.sender,receiver:data?.receiver},
  //     //             {sender:data?.receiver,receiver:data?.sender}
  //     //         ]
  //     //     })
  //     let conversation = await ConversationModel.findOne(
  //         {
  //             $or:
  //             [
  //                 {conversationId:data.sender+data.receiver},
  //                 {conversationId:data.receiver+data.sender}
  //             ]
  //         }
  //         )
  //         // {conversationId:data.sender+data.receiver},
  //         // {conversationId:data.receiver+data.sender}
  //         console.log('message data', data)
  //         // console.log('Conversation ',conversation)
  //     // if conversation is not available then create it
  //     if(!conversation){
  //         const createConversation = new ConversationModel({
  //             sender: data?.sender,
  //             receiver: data?.receiver,
  //             conversationId: data?.sender+data?.receiver,
  //             // messageType: req.body.messageType,
  //             // message: req.body.message,
  //         });
  //         conversation = await createConversation.save()
  //     }
  //         console.log('Conversation ',conversation)
  //         const message = new MessageModel({
  //             // conversationId:data.sender+data.receiver,
  //             text: data.text,
  //             imageUrl: data.imageUrl,
  //             videoUrl: data.videoUrl,
  //             msgByUserId : data?.msgByUserId
  //         })
  //         const saveMessage = await message.save()
  //         const updateConversation = await ConversationModel.updateOne({_id:conversation._id},{
  //             "$push" : { messages: saveMessage._id}
  //         })
  //         const getConversationMessage = await ConversationModel.findOne(
  //             {
  //                 $or:
  //                 [
  //                     {conversationId:data.sender+data.receiver},
  //                     {conversationId:data.receiver+data.sender}
  //                 ]
  //             }
  //             ).populate('messages').sort({updatedAt : -1})
  //         console.log('getConversation', getConversationMessage)

  //     io.to(data?.sender).emit('message', getConversationMessage?.messages || [])
  //     io.to(data?.receiver).emit('message', getConversationMessage?.messages || [])
  //   // send conversation
  //   const conversationSender = await getConversation(data?.sender)
  //   const conversationReceiver = await getConversation(data?.receiver)

  //     io.to(data?.sender).emit('conversation', conversationSender)
  //     io.to(data?.receiver).emit('conversation', conversationReceiver)
  // })

  // // sider bar messages
  // socket.on('sidebar',async (currentUserId)=>{

  //     const conversation = await getConversation(currentUserId)
  //     socket.emit('conversation', conversation)
  // })
  // socket.on('seen',async (msgByUserId)=>{
  //     let conversation = await ConversationModel.findOne(
  //         {
  //             $or:
  //             [
  //                 {conversationId:myUserId+msgByUserId},
  //                 {conversationId:msgByUserId+myUserId}
  //             ]
  //         }
  //         )
  //         const conversationMessageId = conversation?.messages || []
  //         const updateMessages = await MessageModel.updateMany(
  //          {_id : { "$in" : conversationMessageId },msgByUserId : msgByUserId },
  //          {"$set" : {seen : true }}
  //         )

  //         // send conversation
  //   const conversationSender = await getConversation(myUserId)
  //   const conversationReceiver = await getConversation(msgByUserId)

  //     io.to(myUserId).emit('conversation', conversationSender)
  //     io.to(msgByUserId).emit('conversation', conversationReceiver)
  // })
  /// Commentented until this point
  // socket.on('sendMessage' data =>{
  //     const user = getUser(data.receiver)
  //     io.to(user.socketId).emit('getMessage', data)
  // })
  //     const token = socket.handshake.auth.token

  //    const user = await getUserDetailsFromToken(token)

  // console.log('token user detail ', user)
  // create a room
  // disconnect
  /// for making calls using socket
  socket.broadcast.emit('callended');
  socket.on('calluser', ({userToCall, signalData, from, name}) => {
    io.to(userToCall).emit('calluser', {signal: signalData, from, name});
  });
  socket.on('answerCall', data => {
    io.to(data.to).emit('callaccepted', data.signal);
  });
  socket.on('disconnect', () => {
    /// For Chatting With Socket Commented Later For Call Implementation
    // onlineUser.delete(myUserId)
    if (userId) {
      console.log(
        `User connected : userId => ${userId}, socketId => ${socket.id}`,
      );
      delete userSocketMap[userId];
    }
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
    console.log('disconnected user'); //socket.id
  });
});

/// On socket connected main function

app.use(
  cors({
    origin: process.env.FRONT_END, //https://findmylifestyle.onrender.com //http://localhost:3000 "http://localhost:8000"
    // methods: "GET,POST,PUT,DELETE",
    credentials: true,
  }),
);

app.use(
  cookieSession({
    name: 'session',
    keys: ['fmlKeys'],
    maxAge: 24 * 60 * 60 * 100,
  }),
);

// const server = new http.createServer(app)
// const io = socketIO(Server,  {
//     cors:{
//     origin:"http://localhost:5000",
//     methods: ["GET,POST,PUT,DELETE"],
//     credentials: true,
// },
// })
// io.on("conection",(socket)=>{
//     console.log("user connected")
//     console.log("Id", socket.id)
// })

app.use(passport.initialize());
app.use(passport.session());

// 'mongodb+srv://FMLDB:iP24ga9StAn3kyYh@findmylifestyle.oyw4bft.mongodb.net/UsersInfo?retryWrites=true&w=majority&appName=Findmylifestyle'
// connection string with db and server
// const PORT = 8000
const PORT = 8000 || proces.env.PORT;

// mongoose.connect(process.env.MonogoDb_URL).then(() => {
//   console.log('mongoose database connected');
//   app.listen(PORT, () => {
//     console.log('API is listening on port ', PORT);
//   });
// });

// connect data base function and listen on local port
connectDB().then(() => {
  server.listen(PORT, async () => {
    console.log('API is listening on port ', PORT);
  });
});
// const server = app.listen(PORT, () => {
//   console.log('API is listening on port ', PORT);
// });
// const io = require('socket.io')(server);

//     // const ioServer = new Server(8000,{
//     //     cors:{
//     //         origin: 'http://localhost:8000'
//     //     }
//     // })

//     io.on("conection",(socket)=>{
//     console.log("user connected", socket)
//     // console.log("Id", socket.id)
//     })
//"type": "module",

/// nodemailer to send verification link
const AdminEmail = 'abdulrehmancsjob@gmail.com';
const AdminPass = 'Neversaynever4332';
// console.log('auth email', process.env.AUTH_EMAIL)
// let transporter = nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//         user: AdminEmail,
//         pass: AdminPass,
//     }
// })
// transporter.verify((error, success)=>{
//     if(error){
//         console.log(error)
//     }else{
//         console.log("nodemailer ready for messages")
//         console.log(success)
//     }
// })

// const morgan = require("morgan");
// const helmet = require("helmet");

// const jsonwebtoken=require("jsonwebtoken");

// using api through routes
// app.use("socialapp/api/users", userRoute);
// app.use("socialapp/api/users", authRoute);
// app.get('/socialapp/api/users', (req,res)=>{
//    res.send("hello user router")
// })

app.get('/', (req, res) => {
  res.send('working');
});

// google responsen api
app.get('/auth/google', passport.authenticate('google', ['profile', 'email']));
// Google Authentication Api's
app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: '/login/failed',
  }),
);
// auth failure api
app.get('/login/failed', (req, res) => {
  res.status(401).json({
    error: true,
    message: 'Log in failure',
  });
});
//auth success api
app.get('/auth/login/success', (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: 'Succcess fully loged in',
      user: req.user,
    });
  } else {
    res.status(403).json({
      error: true,
      message: 'Not Authorize',
    });
  }
});

// logout api
app.get('/auth/logout', (req, res) => {
  req.logout(res.redirect(process.env.CLIENT_URL));
});

// get all the users from db
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// get one user from db
app.get('/api/users/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// get one user followers from db
app.get('/api/users/followers/:id', async (req, res) => {
  try {
    const {id} = req.params;
    // const user = await User.findById(id);

    const user = await User.findOne({_id: req.params.id});
    // const currentUser = await User.findOne({ _id: req.body.userId });
    let currentUser = [];
    let isFollowed = false;
    user.followers.map(async item => {
      const currentUsers = item; //await User.find({ item });
      currentUser.push(currentUsers);
      // if (item == req.body.userId) {
      //     isFollowed = true
      // }
    });
    let allFollowers = await User.find({_id: currentUser});

    res.status(200).json(allFollowers);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

//   // update user in db
// app.put('/api/users/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const user = await User.findByIdAndUpdate(id, req.body);
//         if (!user) {
//             return res.status(404).json({ message: "User not found" })
//         }
//         const updatedUser = await User.findById(id);
//         res.status(200).json(updatedUser);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

//  // delete user from db
app.delete('/api/users/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }
    res.status(200).json({message: 'Product deleted successfully'});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// ragister or create a new user
// app.post('/api/users', userRouter);

// login or signin a new user
// app.post('/api/users/login', async (req, res) => {
//     try {
//         const user = await User.findOne({ email: req.body.email })
//         !user && res.status(200).json({ status: false, message: "user not found" });
//         if (user) {
//             if (req.body.password == user.password) {
//                 const token = jwt.sign({email:user.email}, Jwt_Secret)
//                 res.status(200).json({ status: "ok", message: "Token saved successfully ", data: token })
//             } else {
//                 res.status(200).json({ status: false, message: "Wrong Password" })
//             }
//         }
//         // && res.status(200).json({status:true, message:"User found successfully ", data:user})
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// get all user
app.use('/api/users', userRouter);
//   // update user post in db
app.put('/api/users/update/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const user = await User.findByIdAndUpdate(id, req.body);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }
    const updatedUser = await User.findById(id);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// get user data after log in
// app.post('/api/users', userRouter);
// get user data after log in
// app.post('/api/users', userRouter);
// save user email with OTP
// app.post('/api/users', userRouter);
// data', async (req, res) => {
//     const {token} = req.body
//     try {
//         const user = jwt.verify(token,Jwt_Secret)
//         const useremail = user.email
//         User.findOne({email:useremail}).then(data=>{
//             return res.send({status:"ok",data:data})
//         })
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// app.get('/api/users/userdetails/token', async (req, res) => {
//     try {
//         const token = req.cookies.token || ""

//             const decode = await jwt.verify(token, Jwt_Secret)
//             // const email = decode.email
//             // decode.id
//             // const { id } = req.params;
//             // const user = await User.findById(id);
//             const user  = await User.findById(decode.id).select('-password')

//             // const liveStream = await LiveStreamData.find({streamLive: true});
//             res.status(200).json(user);

//             // })
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// ragister or create a new user
app.post('/api/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// find all user excluding one user
app.get('/api/users/notme/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const users = await User.find({_id: {$ne: id}}); //{_id:{$ne:id}}
    res.status(200).json(users);

    // const { id } = req.params;
    // const user = await User.findById(id);
    // res.status(200).json(user);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// Send Follow Request to other user api
app.put('/api/users/followRequest/:id', async (req, res) => {
  try {
    const userData = await User.findOne({_id: req.params.id});
    const currentUser = await User.findOne({_id: req.body.userId});

    let followingRequestSent = false;

    let tempSentRequests = [];
    let tempFollowRequest = [];

    tempSentRequests.push(userData.sentFollowingRequests);
    tempFollowRequest.push(currentUser.followRequests);

    tempSentRequests.map(item => {
      if (item == req.body.userId) {
        followingRequestSent = true;
      }
    });
    // res.json(followingRequestSent)//userData.sentFollowingRequests,' => ',

    let alreadyHaveFollowRequest = false;

    tempFollowRequest.map(item => {
      if (item == req.params._id) {
        alreadyHaveFollowRequest = true;
      }
    });
    if (followingRequestSent) {
      const res1 = await User.updateOne(
        {_id: req.params.id},
        {$pull: {sentFollowingRequests: req.body.userId}},
      );

      const res2 = await User.updateOne(
        {_id: req.body.userId},
        {$pull: {followRequests: req.params.id}},
      );

      res
        .status(200)
        .json({status: true, message: 'follow request removed successfully'});
    } else {
      const res1 = await User.updateOne(
        {_id: req.params.id},
        {$push: {sentFollowingRequests: req.body.userId}},
      );

      const res2 = await User.updateOne(
        {_id: req.body.userId},
        {$push: {followRequests: req.params.id}},
      );

      res.status(200).json({
        status: true,
        message: 'follow request sent to user successfully',
      });
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// Approve Follow Request for User
app.put('api/users/acceptFollowRequest/:id', async (req, res) => {
  try {
    const userData = await User.findOne({_id: req.params.id});
    const currentUser = await User.findOne({_id: req.body.userId});
    let followingRequestSent = false;
    let tempSentRequests = [];
    let tempFollowRequest = [];
    tempSentRequests.push(userData.sentFollowingRequests);
    // tempFollowRequest.push(currentUser.followRequests)
    tempSentRequests.map(item => {
      if (item == req.body.userId) {
        followingRequestSent = true;
      }
    });
    res.status(200).json({
      status: true,
      message: 'follow request accepted successfully',
      data: tempSentRequests,
    });

    // let alreadyHaveFollowRequest = false

    // tempFollowRequest.map(item=>{
    //     if(item == req.params._id){
    //         alreadyHaveFollowRequest = true
    //     }
    // })
    // if (followingRequestSent) {
    //     const res1 = await User.updateOne({ _id: req.params.id }, { $push: { followers: req.body.userId } });

    //     const res2 = await User.updateOne({ _id: req.body.userId }, { $push: { following: req.params.id } });

    //     const res3 = await User.updateOne({ _id: req.params.id }, { $pull: { sentFollowingRequests: req.body.userId } });

    //     const res4 = await User.updateOne({ _id: req.body.userId }, { $pull: { followRequests: req.params.id } });

    //     res.status(200).json({ status: true, message: "follow request accepted successfully" })

    // }
    // // recepient.friendRequests = recipient.friendRequests.filter(
    // //     (request) => request.toString() !== senderId.toString()
    // // )
    // else {
    //     res.status(200).json({ status: true, message: "no user request found to follow" })

    // }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// follow other user api
app.put('/api/users/follow/:id', async (req, res) => {
  try {
    const user = await User.findOne({_id: req.params.id});
    const currentUser = await User.findOne({_id: req.body.userId});

    let isFollowed = false;
    user.followers.map(item => {
      if (item == req.body.userId) {
        isFollowed = true;
      }
    });
    if (isFollowed) {
      const res1 = await User.updateOne(
        {_id: req.params.id},
        {$pull: {followers: req.body.userId}},
      );

      const res2 = await User.updateOne(
        {_id: req.body.userId},
        {$pull: {following: req.params.id}},
      );

      res
        .status(200)
        .json({status: true, message: 'unfollowed user successfully'});
    } else {
      const res1 = await User.updateOne(
        {_id: req.params.id},
        {$push: {followers: req.body.userId}},
      );

      const res2 = await User.updateOne(
        {_id: req.body.userId},
        {$push: {following: req.params.id}},
      );

      res
        .status(200)
        .json({status: true, message: 'followed user successfully'});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// fetch all follow requests of a particular user
app.get('/api/users/followRequestList/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const user = await User.findById(id).populate('followRequests').lean();
    const followRequests = user.followRequests;

    res.json(followRequests);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// fetch all followers list of a particular user
app.get('/api/users/followersList/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const user = await User.findById(id).populate('followers').lean();
    const followersList = user.followers;

    res.json(followersList);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// create a user message or conversation
app.post('/api/message/add', async (req, res) => {
  //upload.single("imageUrl"),
  try {
    //  const userPost = await UserPostData.create(req.body);
    const newMessage = new ConversationModel({
      sender: req.body.sender,
      receiver: req.body.receiver,
      conversationId: req.body.conversationId,
      messageType: req.body.messageType,
      message: req.body.message,
    });
    await newMessage.save();
    // if (req.file) {
    //     message.imageUrl = req.file.filename;
    // }
    res
      .status(200)
      .json({message: 'Message Send Successfully', data: newMessage});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// create a user message with new Message and new Conversation Schema send message
app.post('/api/message/create/:receiverId/:senderId', async (req, res) => {
  try {
    const senderId = req.params.senderId;
    const receiverId = req.params.receiverId;
    const {message} = req.body; //    const {textMessage: message} = req.body;

    console.log(message);
    let conversation = await Conversation.findOne({
      participants: {$all: [senderId, receiverId]},
    });
    // establish the convestion if not started yet
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });
    if (newMessage) conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    // implement socket io for real time messaging
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage);
    }

    res.status(200).json({
      message: 'Message Send Successfully',
      success: true,
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// get user messages with new Message and new Conversation Schema get all messages
app.get('/api/message/get/:receiverId/:senderId', async (req, res) => {
  try {
    const senderId = req.params.senderId;
    const receiverId = req.params.receiverId;
    let conversation = await Conversation.findOne({
      participants: {$all: [senderId, receiverId]},
    }).populate('messages');
    // establish the convestion if not started yet
    // const eventPost = await EventPostData.find({}).populate('userId');

    if (!conversation)
      res.status(200).json({
        message: 'No Chat Found',
        success: true,
        messages: [],
      });
    res.status(200).json({
      message: 'Conversation found',
      success: true,
      messages: conversation?.messages,
    });
    // implement socket io for real time messaging
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// get Conversation between two user
app.get('/api/messages/all/:senderId/:receiverId', async (req, res) => {
  try {
    const {senderId, receiverId} = req.params;
    const messages = await ConversationModel.find({
      $or: [
        {senderId: senderId, receiverId: receiverId},
        // {senderId:receiverId, receiverId:senderId}
      ],
    }).populate('sender');
    res.json(messages);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});
// get Conversation between two user
app.get('/api/messages/:senderId/:receiverId', async (req, res) => {
  try {
    const {senderId, receiverId} = req.params;
    const messages = await ConversationModel.find({
      $or: [
        {conversationId: senderId + receiverId},
        {conversationId: receiverId + senderId},
      ],
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// Save User Post API
app.put('/api/users/savepost/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const user = await User.findByIdAndUpdate(id, req.body);
    let isSaved = false;
    // const postId="12345"
    // user.SavedPosts.map(item => {
    //     if (item == req.body.postId) {
    //         isSaved = true
    //     }else{
    //         isSaved = false
    //     }
    // })
    // if (!user) {
    //     return res.status(404).json({ message: "User not found" })
    // }
    // const updatedUser = await User.findById(id);
    // res.status(200).json(updatedUser);
    // if (isSaved) {
    // const res1 = await user.updateOne({ _id: req.params.id }, { $pull: { SavedPosts: req.body } });
    // res.status(200).json({ status: true, message: "User Post Like removed succesfully" })
    // } else {
    const res2 = await user.updateOne(
      {_id: req.params.id},
      {$push: {SavedPosts: req.body.postId}},
    );
    res
      .status(200)
      .json({status: true, message: 'User Post Liked successfully'});

    // }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});
// Add Event To WishList API
app.put('/api/users/wishlist/:id', async (req, res) => {
  try {
    const user = await User.findOne({_id: req.params.id});
    let isAdded = false;

    user.EventsWishList.map(item => {
      if (item == req.body.eventId) {
        isAdded = true;
      } else {
        isAdded = false;
      }
    });
    if (isAdded) {
      const res1 = await User.updateOne(
        {_id: req.params.id},
        {$pull: {EventsWishList: req.body.eventId}},
      );
      res.status(200).json({
        status: true,
        message: 'Event removed from wishlist succesfully',
      });
    } else {
      const res2 = await User.updateOne(
        {_id: req.params.id},
        {$push: {EventsWishList: req.body.eventId}},
      );

      res
        .status(200)
        .json({status: true, message: 'Event Added To WishList successfully'});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// unfollow other user api
//   app.put('/api/users/unfollow/:id',async(req,res)=>{
//     try {
//         const user = await User.findOne({_id: req.params.id})
//         const currentUser = await User.findOne({_id:req.body.userId});

//         let isFollowed = false
//         user.followers.map(item=>{
//             if(item == req.body.userId){
//                 isFollowed = true
//             }
//         })
//         if(!isFollowed){
//             res.status(200).json({status:false, message:"you're not following user "})
//         }else{
//             const res1 = await User.updateOne({_id:req.params.id},{$pull:{followers:req.body.userId}});

//             const res2 = await User.updateOne({_id:req.body.userId},{$pull:{following:req.params.id}});

//             res.status(200).json({status:true, message:"unfollowed user successfully"})

//         }
//     } catch (error) {
//         res.status(500).json({message:error.message});
//     }
//  });

// create a simple user post
app.post('/api/userposts/add', async (req, res) => {
  //upload.single("imageUrl"),
  try {
    //  const userPost = await UserPostData.create(req.body);
    const userPost = await UserPostData.create({
      caption: req.body.caption,
      username: req.body.username,
      userId: req.body.userId,
      imageUrl: req.body.imageUrl,
    });
    if (req.file) {
      userPost.imageUrl = req.file.filename;
    }
    res.status(200).json(userPost);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});
// get all the user posts from db
app.get('/api/userposts', async (req, res) => {
  try {
    const userPost = await UserPostData.find({}).populate('userId');
    res.status(200).json(userPost);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});
// get all the posts by any user from db
app.get('/api/userpostsget/:id', async (req, res) => {
  try {
    const userPost = await UserPostData.find({userId: req.params.id});
    if (!userPost) {
      res
        .status(200)
        .json({status: false, message: 'no data found for this user'});
    } else {
      res.status(200).json(userPost);
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});
// get one user post from db
app.get('/api/userposts/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const userPost = await UserPostData.findById(id);
    res.status(200).json(userPost);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

//   // update user post in db
app.put('/api/userposts/update/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const userPost = await UserPostData.findByIdAndUpdate(id, req.body);
    if (!userPost) {
      return res.status(404).json({message: 'User not found'});
    }
    const updatedUserPost = await UserPostData.findById(id);
    res.status(200).json(updatedUserPost);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

//  // delete user post from db
app.delete('/api/userposts/delete/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const userPost = await UserPostData.findByIdAndDelete(id);
    if (!userPost) {
      return res.status(404).json({message: 'User not found'});
    }
    res.status(200).json({message: 'Product deleted successfully'});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// Like user post API
app.put('/api/userposts/like/:id', async (req, res) => {
  try {
    const userWhoLikedId = req.body.userId;
    const userPost = await UserPostData.findOne({_id: req.params.id});
    let isLiked = false;

    userPost.postLikes.map(item => {
      if (item == req.body.userId) {
        isLiked = true;
      } else {
        isLiked = false;
      }
    });
    if (isLiked) {
      const res1 = await UserPostData.updateOne(
        {_id: req.params.id},
        {$pull: {postLikes: req.body.userId}},
      );
      /// implement socket io for real life time to send notification
      const user = await User.findById(userWhoLikedId).select(
        'name profilePic',
      );
      const postOwnerId = userPost.userId.toString();
      if (postOwnerId !== userWhoLikedId) {
        // emit a notification event
        const notification = {
          type: 'like',
          userid: userWhoLikedId,
          userDetails: user,
          postId: userPost._id,
          message: 'Your post was liked',
        };
        const postOwnerSocketId = getReceiverSocketId(postOwnerId);
        io.to(postOwnerSocketId).emit('notification', notification);
      }

      ///
      res.status(200).json({
        status: true,
        message: 'User Post Like removed succesfully',
        data: userPost,
      });
    } else {
      const res2 = await UserPostData.updateOne(
        {_id: req.params.id},
        {$push: {postLikes: req.body.userId}},
      );

      /// implement socket io for real life time to send notification
      const user = await User.findById(userWhoLikedId).select(
        'name profilePic',
      );
      const postOwnerId = userPost.userId.toString();
      if (postOwnerId !== userWhoLikedId) {
        // emit a notification event
        const notification = {
          type: 'dislike',
          userid: userWhoLikedId,
          userDetails: user,
          postId: userPost._id,
          message: 'Your post was liked',
        };
        const postOwnerSocketId = getReceiverSocketId(postOwnerId);
        io.to(postOwnerSocketId).emit('notification', notification);
      }

      ///

      res
        .status(200)
        .json({status: true, message: 'User Post Liked successfully'});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// post a comment under user Post
app.post('/api/postComments/add', async (req, res) => {
  try {
    const newComment = new UserCommentData({
      comment: req.body.comment,
      userId: req.body.userId,
      postId: req.body.postId,
      username: req.body.username,
    });
    await newComment.save();
    res.status(200).json({status: true, message: 'Comment added successfully'});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

//  // delete user post comment from db
app.delete('/api/postComments/delete/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const postComments = await UserCommentData.findByIdAndDelete(id);
    if (!postComments) {
      return res.status(404).json({message: 'no comment found'});
    }
    res.status(200).json({message: 'Comment deleted successfully'});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// get all the comments for any posts from db
app.get('/api/postComments/post/:id', async (req, res) => {
  try {
    const postComments = await UserCommentData.find({postId: req.params.id});
    if (!postComments) {
      res.status(200).json({
        status: false,
        message: 'no comment data found for this Event Post',
      });
    } else {
      res.status(200).json(postComments);
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

//   // update comment for user post in db
app.put('/api/postComments/update/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const postComments = await UserCommentData.findByIdAndUpdate(id, req.body);
    if (!postComments) {
      return res.status(404).json({message: 'Comment not found'});
    }
    const updatedPostComment = await UserCommentData.findById(id);
    res.status(200).json(updatedPostComment);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// create a event
app.post('/api/eventposts/add', async (req, res) => {
  //upload.single("imageUrl"),
  try {
    //  const eventPost = await EventPostData.create(req.body);
    const eventPost = await EventPostData.create({
      eventName: req.body.eventName,
      //   caption: req.body.caption,
      // username: req.body.username,
      userId: req.body.userId,
      location: {
        type: 'Point',
        coordinates: [
          parseFloat(req.body.longitude),
          parseFloat(req.body.latitude),
        ],
      },
      imageUrl: req.body.imageUrl,
      members: req.body.members,
      eventDescription: req.body.eventDescription,
      // eventDate: req.body.eventDate,
      eventCategory: req.body.eventCategory,
      //   eventTime: req.body.eventTime,
      //   caption: req.body.caption,
      //   gender: req.body.gender,
      //   rank: req.body.rank,
      //   level: req.body.level,
      //   email: req.body.email,
      eventType: req.body.eventType,
      ticketFreeAmenities: req.body.ticketFreeAmenities,
      ticket1Amenities: req.body.ticket1Amenities,
      ticket2Amenities: req.body.ticket2Amenities,
      ticket3Amenities: req.body.ticket3Amenities,
      ticket4Amenities: req.body.ticket4Amenities,
      ticket5Amenities: req.body.ticket5Amenities,
      ticket1Price: req.body.ticket1Price,
      ticket2Price: req.body.ticket2Price,
      ticket3Price: req.body.ticket3Price,
      ticket4Price: req.body.ticket4Price,
      ticket5Price: req.body.ticket5Price,
      ticketFreeCount: req.body.ticketFreeCount,
      ticket1Count: req.body.ticket1Count,
      ticket2Count: req.body.ticket2Count,
      ticket3Count: req.body.ticket3Count,
      ticket4Count: req.body.ticket4Count,
      ticket5Count: req.body.ticket5Count,
      viewPermission: req.body.viewPermission,
      //   ticket1Buyer: [
      //     {
      //       user: req.body.userId,
      //       totalTickets: req.body.ticket1Count,
      //     },
      //   ],
      // ticket2Buyer: {
      //     details: [req.body.userId, req.body.ticket2Count]
      // },
      // ticket3Buyer: {
      //     details: [req.body.userId, req.body.ticket3Count]
      // },
      // ticket4Buyer: {
      //     details: [req.body.userId, req.body.ticket4Count]
      // },
      // ticket5Buyer: {
      //     details: [req.body.userId, req.body.ticket5Count]
      // },
      //   eventStartDate: req.body.eventStartDate,
      //   eventEndDate: req.body.eventEndDate,
      //   eventStartTime: req.body.eventStartTime,
      //   eventEndTime: req.body.eventEndTime,
      // userCoverPic: req.body.userCoverPic,
      //   profilePic: req.body.profilePic,
    });
    if (req.file) {
      eventPost.imageUrl = req.file.filename;
    }
    res.status(200).json(eventPost);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});
// location:{
//     type:"Point",
//     coordinates:[parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
// }
// "caption":"location post by last user ",
// 	"username":"last user",
// 	"userId":"6639fcc4e42506e0b5c65f0e",

// get all the permitted events for user from db
app.get('/api/eventposts/users/:id', async (req, res) => {
  try {
    const eventPost = await EventPostData.find({
      viewPermission: req.params.id,
    }).populate({
      path: 'Users',
      sort: {createdAt: -1},
      populate: {
        path: 'userId',
        select: 'name profilePic',
      },
    });
    if (!eventPost) {
      res.status(200).json({
        status: false,
        message: 'no permitted data found for this Event Post',
      });
    } else {
      res.status(200).json(eventPost);
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// get one event post from db
app.get('/api/eventposts/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const eventPost = await EventPostData.findById(id);
    res.status(200).json(eventPost);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

//   // update event post in db
app.put('/api/eventposts/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const eventPost = await EventPostData.findByIdAndUpdate(id, req.body);
    if (!eventPost) {
      return res.status(404).json({message: 'User not found'});
    }
    const updatedeventPost = await EventPostData.findById(id);
    res.status(200).json(updatedeventPost);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

//  // delete event post from db
app.delete('/api/eventposts/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const eventPost = await EventPostData.findByIdAndDelete(id);
    if (!eventPost) {
      return res.status(404).json({message: 'User not found'});
    }
    res.status(200).json({message: 'Product deleted successfully'});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// get all the event posts from db
app.get('/api/eventposts', async (req, res) => {
  try {
    const eventPost = await EventPostData.find({}).populate('userId');
    // populate({
    //   path: 'Users',
    //   sort: {createdAt: -1},
    //   populate: {
    //     path: 'userId',
    //     select: 'name profilePic',
    //   },
    // });
    res.status(200).json(eventPost);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// add userId's to the view permission
// Like user post API
app.put('/api/eventposts/viewPermission/:id', async (req, res) => {
  try {
    const eventPost = await EventPostData.findOne({_id: req.params.id});
    let isAdded = false;

    eventPost.viewPermission.map(item => {
      if (item == req.body.userId) {
        isAdded = true;
      } else {
        isAdded = false;
      }
    });
    if (isAdded) {
      const res1 = await EventPostData.updateOne(
        {_id: req.params.id},
        {$pull: {viewPermission: req.body.userId}},
      );
      res
        .status(200)
        .json({status: true, message: 'User Permission removed succesfully'});
    } else {
      const res2 = await EventPostData.updateOne(
        {_id: req.params.id},
        {$push: {viewPermission: req.body.userId}},
      );

      res
        .status(200)
        .json({status: true, message: 'User Permission Added successfully'});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// get all the event posts with my view permission
// app.get('/api/eventpostsget/viewpermission/:id', async (req, res) => {
//     try {
//         // const user = await User.findOne({ _id: req.params.id })
//         const eventPost = await EventPostData.find({});
//         const currentUser = await User.findOne({ _id: req.body.userId });

//         let isPermitted = false
//         eventPost.viewPermission.map(item => {
//             if (item == req.body.userId) {
//                 isPermitted = true
//                 return eventPost
//             }
//         })
//         if (isPermitted) {
//             // const eventPostData = eventPost.find({})
//             res.status(200).json(eventPost)
//         } else{
//             res.status(500).json({ status: false, message: "no permission found" })

//         }

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// get all the event posts by any user from db
app.get('/api/eventpostsget/:id', async (req, res) => {
  try {
    const eventPost = await EventPostData.find({userId: req.params.id});
    if (!eventPost) {
      res
        .status(200)
        .json({status: false, message: 'no data found for this user'});
    } else {
      res.status(200).json(eventPost);
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// Like event post API
app.put('/api/eventposts/like/:id', async (req, res) => {
  try {
    const eventPost = await EventPostData.findOne({_id: req.params.id});
    let isLiked = false;

    eventPost.postLikes.map(item => {
      if (item == req.body.userId) {
        isLiked = true;
      }
    });
    if (isLiked) {
      const res1 = await EventPostData.updateOne(
        {_id: req.params.id},
        {$pull: {postLikes: req.body.userId}},
      );
      res
        .status(200)
        .json({status: true, message: 'Post Like removed succesfully'});
    } else {
      const res2 = await EventPostData.updateOne(
        {_id: req.params.id},
        {$push: {postLikes: req.body.userId}},
      );

      res.status(200).json({status: true, message: 'Post Liked successfully'});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// Join event post API
app.put('/api/eventposts/join/:id', async (req, res) => {
  try {
    const eventPost = await EventPostData.findOne({_id: req.params.id});
    let isAdded = false;

    eventPost.eventMembersList.map(item => {
      if (item == req.body.userId) {
        isAdded = true;
      }
    });
    if (isAdded) {
      const res1 = await EventPostData.updateOne(
        {_id: req.params.id},
        {$pull: {eventMembersList: req.body.userId}},
      );
      res.status(200).json({
        status: true,
        message: 'Event Member removed succesfully',
        data: eventPost,
      });
    } else {
      const res2 = await EventPostData.updateOne(
        {_id: req.params.id},
        {$push: {eventMembersList: req.body.userId}},
      );

      res.status(200).json({
        status: true,
        message: 'Event Member Added successfully',
        data: eventPost,
      });
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// post a comment under event
app.post('/api/eventComments/add', async (req, res) => {
  try {
    const newComment = new EventCommentData({
      comment: req.body.comment,
      userId: req.body.userId,
      postId: req.body.postId,
      username: req.body.username,
    });
    await newComment.save();
    res.status(200).json({status: true, message: 'Comment added successfully'});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

//  // delete event post comment from db
app.delete('/api/eventComments/delete/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const eventComment = await EventCommentData.findByIdAndDelete(id);
    if (!eventComment) {
      return res.status(404).json({message: 'no comment found'});
    }
    res.status(200).json({message: 'Comment deleted successfully'});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// get all the comments for any posts from db
app.get('/api/eventComments/post/:id', async (req, res) => {
  try {
    const eventComments = await EventCommentData.find({postId: req.params.id});
    if (!eventComments) {
      res.status(200).json({
        status: false,
        message: 'no comment data found for this Event Post',
      });
    } else {
      res.status(200).json(eventComments);
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

//   // update comment for event post in db
app.put('/api/eventComments/update/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const eventComment = await EventCommentData.findByIdAndUpdate(id, req.body);
    if (!eventComment) {
      return res.status(404).json({message: 'Comment not found'});
    }
    const updatedeventComment = await EventCommentData.findById(id);
    res.status(200).json(updatedeventComment);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// Like event post Comment API
app.put('/api/eventComments/like/:id', async (req, res) => {
  try {
    const eventPostComment = await EventCommentData.findOne({
      _id: req.params.id,
    });
    let isLiked = false;

    eventPostComment.commentLikes.map(item => {
      if (item == req.body.userId) {
        isLiked = true;
      }
    });
    if (isLiked) {
      const res1 = await EventCommentData.updateOne(
        {_id: req.params.id},
        {$pull: {commentLikes: req.body.userId}},
      );
      res.status(200).json({
        status: true,
        message: 'Event Comment Like removed succesfully',
      });
    } else {
      const res2 = await EventCommentData.updateOne(
        {_id: req.params.id},
        {$push: {commentLikes: req.body.userId}},
      );

      res
        .status(200)
        .json({status: true, message: 'Event Comment Liked successfully'});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// create a simple user post
app.post('/api/postreel/add', async (req, res) => {
  //upload.single("imageUrl"),
  try {
    //  const userPost = await UserPostData.create(req.body);
    const postReel = await PostReelData.create({
      caption: req.body.caption,
      username: req.body.username,
      userId: req.body.userId,
      reelUrl: req.body.reelUrl,
    });
    // if (req.file) {
    //     postReel.imageUrl = req.file.filename;
    // }
    res.status(200).json(postReel);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});
// get all the user reels from db
app.get('/api/userreels', async (req, res) => {
  try {
    const postReel = await PostReelData.find({});
    res.status(200).json(postReel);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});
// get all the posts by any user from db
app.get('/api/userreelsget/:id', async (req, res) => {
  try {
    const postReel = await PostReelData.find({userId: req.params.id});
    if (!postReel) {
      res
        .status(200)
        .json({status: false, message: 'no data found for this user'});
    } else {
      res.status(200).json(postReel);
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});
// get one user reel from db
app.get('/api/userreels/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const postReel = await PostReelData.findById(id);
    res.status(200).json(postReel);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

//   // update user reel in db
app.put('/api/userreels/update/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const postReel = await PostReelData.findByIdAndUpdate(id, req.body);
    if (!postReel) {
      return res.status(404).json({message: 'User not found'});
    }
    const updatedUserReel = await PostReelData.findById(id);
    res.status(200).json(updatedUserReel);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

//  // delete user reel from db
app.delete('/api/userreels/delete/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const postReel = await PostReelData.findByIdAndDelete(id);
    if (!postReel) {
      return res.status(404).json({message: 'User not found'});
    }
    res.status(200).json({message: 'Reel deleted successfully'});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// Like user reel API
app.put('/api/userreels/like/:id', async (req, res) => {
  try {
    const postReel = await PostReelData.findOne({_id: req.params.id});
    let isLiked = false;

    postReel.postLikes.map(item => {
      if (item == req.body.userId) {
        isLiked = true;
      } else {
        isLiked = false;
      }
    });
    if (isLiked) {
      const res1 = await PostReelData.updateOne(
        {_id: req.params.id},
        {$pull: {postLikes: req.body.userId}},
      );
      res
        .status(200)
        .json({status: true, message: 'User Reel Like removed succesfully'});
    } else {
      const res2 = await PostReelData.updateOne(
        {_id: req.params.id},
        {$push: {postLikes: req.body.userId}},
      );

      res
        .status(200)
        .json({status: true, message: 'User Reel Liked successfully'});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// post a comment under reel
app.post('/api/reelComments/add', async (req, res) => {
  try {
    const newComment = new ReelCommentData({
      comment: req.body.comment,
      userId: req.body.userId,
      postId: req.body.postId,
      username: req.body.username,
    });
    await newComment.save();
    res.status(200).json({status: true, message: 'Comment added successfully'});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

//  // delete reel comment from db
app.delete('/api/reelComments/delete/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const reelComment = await ReelCommentData.findByIdAndDelete(id);
    if (!reelComment) {
      return res.status(404).json({message: 'no comment found'});
    }
    res.status(200).json({message: 'Comment deleted successfully'});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// get all the comments for any reel from db
app.get('/api/reelComments/post/:id', async (req, res) => {
  try {
    const reelComments = await ReelCommentData.find({postId: req.params.id});
    if (!reelComments) {
      res
        .status(200)
        .json({status: false, message: 'no comment data found for this Reel'});
    } else {
      res.status(200).json(reelComments);
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

//   // update comment for reel in db
app.put('/api/reelComments/update/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const reelComment = await ReelCommentData.findByIdAndUpdate(id, req.body);
    if (!reelComment) {
      return res.status(404).json({message: 'Comment not found'});
    }
    const updatedReelComment = await ReelCommentData.findById(id);
    res.status(200).json(updatedReelComment);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// create a LiveStream
app.post('/api/livestream/add', async (req, res) => {
  //upload.single("imageUrl"),
  try {
    const liveData = await LiveStreamData.create({
      streamName: req.body.streamName,
      userId: req.body.userId,
      liveId: req.body.liveId,
      streamCategory: req.body.streamCategory,
      streamLive: req.body.streamLive,
      streamAudience: req.body.streamAudience,
      streamGifts: req.body.streamGifts,
      liveScore: req.body.liveScore,
      leaderBoard: req.body.leaderBoard,
      favourites: req.body.favourites,
      wallet: req.body.wallet,
      fanClub: req.body.fanClub,
      gaurdrians: req.body.gaurdrians,
      imageUrl: req.body.imageUrl,
      streamLikes: req.body.streamLikes,
      streamShares: req.body.streamShares,
      streamDuration: req.body.streamDuration,
      // location: {
      //     type: "Point",
      //     coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
      // },
    });
    res.status(200).json(liveData);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// update a LiveStream
app.put('/api/livestream/update/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const liveStream = await LiveStreamData.findByIdAndUpdate(id, req.body);
    if (!liveStream) {
      return res.status(404).json({message: 'livestream not found'});
    }
    const updatedLivestream = await LiveStreamData.findById(id);
    res.status(200).json(updatedLivestream);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// get only live LiveStreams from db
app.get('/api/livestream/live', async (req, res) => {
  try {
    const liveStream = await LiveStreamData.find({streamLive: true});
    res.status(200).json(liveStream);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// get all the LiveStreams from db
app.get('/api/livestream', async (req, res) => {
  try {
    const liveStream = await LiveStreamData.find({}).populate('userId');
    res.status(200).json(liveStream);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
});

// require('./UserDetails')
// // collection
// const User = mongoose.model("UserInfo")
// // Api to register User
// app.post("/register",async(req,res)=>{
//    const {name,email,password} = req.body;
//     try {
//         // const salt = await bcrypt.genSalt(10)
//         // const hashedPassword = await bcrypt.hash(req.body.password,salt);
// // check if the email is already registered
//         // const existingUser = await User.findOne({emailId});
//         // if(existingUser){
//         //     return res.status(400).json({message:"Email already registered"});
//         // }
// // create a new User
//         // const newUser = new User({
//         //     name:req.body.name,
//         //     email:req.body.email,
//         //     // gender:req.body.gender,
//         //     // dob:req.body.dob,
//         //     // profilePic:req.body.profilePic,
//         //     password:hashedPassword,
//         // });
//         // console.log('data ',name, email, password )
//         await User.create({
//             name:name,
//             email:email,
//             password:password,
//         })
//         // res.send({status:"ok", data:"User Created"})
//         // generate and store the verification token
//         // newUser.verficationToken = crypto.randomBytes(20).toString("hex");

//         // save the user to the database
//         // await newUser.save();
//         // res.status(200).json(newUser);

//         // console.log('Register Status ', json(newUser))
//         // send verification email to the user
//         // sendVerificationEmail(newUser.emailId, newUser.verficationToken)
//     } catch (error) {
//         res.send({status:"error", data: error})
//         // console.log(error);
//         // res.status(500).json(error);
//     }
//    });

// app.get('/',(req, res)=>{
//     res.send({status:'started'});
// })
