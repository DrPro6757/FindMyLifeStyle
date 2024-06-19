const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    // id:{
    //     type:String,
    //     required:true,
    // },
    username:{
        type:String,
        max:50,
        // required:true
    },
    emailId:{
        type:String,
        max:50,
        // required:true,
        // unique:true
    },
    // mobile:{
    //     type:String,
    //     max:50,
    //     required:true,
    //     unique:true
    // },
    password:{
        type:String,
        max:50,
        // required:true
    },
    // gender:{
    //     type:String,
    //     max:50,
    //     required:true
    // },
    // dob:{
    //     type:String,
    //     max:50,
    //     required:true
    // },
    // address:{
    //     type:String,
    //     max:100,
    // },
    // profilePic:{
    //     type:String,
    //     default:"",
    // },
    // coverPic:{
    //     type:String,
    //     default:"",
    // },
    // followers:{
    //     type:Array,
    //     default:[],
    // },
    // following:{
    //     type:Array,
    //     default:[],
    // },
    // EventsWishList:{
    //     type:Array,
    //     default:[],
    // },
    // about:{
    //     type:String,
    //     max:70,
    // },
    // age:{
    //     type:Number,
    //     default:0,
    // },
    // chatsBy:{
    //     type:Array,
    //     default:[],
    // },
    // education:{
    //     type:String,
    //     max:50,
    // },
    // eventsJoined:{
    //     type:Array,
    //     default:[],
    // },
    // eventsPosted:{
    //     type:Number,
    //     default:0,
    // },
    // fcmToken:{
    //     type:String,
    //     default:"",
    // },
    // interest:{
    //     type:String,
    //     default:""
    // },
    // messageFrom:{
    //     type:Array,
    //     default:[]
    // },
    // myLikedEvents:{
    //     type:Array,
    //     default:[],
    // },
    // myLocation:{
    //     type:Geolocation,
    // },
    // photos:{
    //     type:Array,
    //     default:[],
    // },
    // profileLikes:{
    //     type:Array,
    //     default:[],
    // },
    // relationshipStatus:{
    //     type:String,
    //     default:"",
    // },
    // onlineStatus:{
    //     type:Boolean,
    //     default:true,
    // },
    // work:{
    //     type:String,
    //     max:70,
    //     default:"",
    // },
    // verficationToken:String,
},{collection:"users"});
module.exports = mongoose.model("users",userSchema);