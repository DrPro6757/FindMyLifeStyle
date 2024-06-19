const mongoose = require('mongoose');

const PostEventSchema = mongoose.Schema({
    eventName:{
        type:String,
        max:170,
        required:true
    },
    caption:{
        type:String,
        max:200
    },
    username:{
        type:String,
        required:true
    },
    userCoverPic:{
        type:String,
    },

    userId:{
        type:String,
        required:true
    },
    profilePic:{
        type:String,
    },
    imageUrl:{
        type:String,
        required:true
    },
    location:{
        type:{type:String,required:true},
       coordinates:[],
    },
    postLikes:{
        type:Array,
        default:[],
    },
    postComments:{
        type:Array,
        default:[],
    },
    
    postShares:{
        type:Array,
        default:[],
    },
    caption:{
        type:String,
    },
    email:{
        type:String,
    },
    eventDate:{
        type:String,
    },
    eventTime:{
        type:String,
        max:200
    },
    eventDescription:{
        type:String,
    },
    eventJoinRequests:{
        type:Array,
        default:[],
    },
    eventMembersList:{
        type:Array,
        default:[],
    },
    gender:{
        type:String,
    },
    interest:{
        type:String,
    },
    level:{
        type:String,
    },
    rank:{
        type:Number,
    },
    members:{
        type:Number,
    },
    postTimeData:{
        type:String,
    },
    userImage:{
        type:String,
    },
    status:{
        type:String,
    },
    fcmTokens:{
        type:Array,
        default:[],
    }
   

},
{timestamps:true}
);
PostEventSchema.index({location:"2dsphere"})
const PostEvent = mongoose.model("Posts_Events",PostEventSchema);

module.exports = PostEvent;

// coordinates:[-0.14184,51.50152]

// location:{
//     type:"Point",
//     coordinates:[parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
// }
