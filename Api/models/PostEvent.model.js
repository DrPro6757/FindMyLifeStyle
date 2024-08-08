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
        // required:true
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
        type : Array,
        default:[],
        required : true
        // type:{type:String,required:true},
        // file:[]
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
    ticketFreeAmenities:{
        type:String,
    },
    ticket1Amenities:{
        type:String,
    },
    ticket2Amenities:{
        type:String,
    },
    ticket3Amenities:{
        type:String,
    },
    ticket4Amenities:{
        type:String,
    },
    ticket5Amenities:{
        type:String,
    },
    ticket1Prices:{
        type:String,
    },
    ticket2Prices:{
        type:String,
    },
    ticket3Prices:{
        type:String,
    },
    ticket4Prices:{
        type:String,
    },
    ticket5Prices:{
        type:String,
    },
    eventType:{
        type:String,
    },
    viewPermission:{
        type: Array,
        default:[]
    },
    eventCategory:{
        type:String,
    },
    importantNote:{
        type:String,
        max:200
    },
    eventStartDate:{
        type:String,
    },
    eventDate:{
        type:String,
    },
    eventEndDate:{
        type:String,
    },
    eventDays:{
        type:String,
    },
    eventTime:{
        type:String,
        max:200
    },
    eventStartTime:{
        type:String,
        max:200
    },
    eventEndTime:{
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
// {path: '', fileType:''}
