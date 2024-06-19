const mongoose = require('mongoose');

const PostUserSchema = mongoose.Schema({
    caption:{
        type:String,
        max:200
    },
    username:{
        type:String,
        required:true
    },

    userId:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
    },
    videoUrl:{
        type:String,
    },
    reelUrl:{
        type:String,
    },
    location:{
        type:{type:String},
       coordinates:[],
    },
    profilePic:{
        type:String,
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
    email:{
        type:String,
    },
    postDescription:{
        type:String,
    },
    interest:{
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
PostUserSchema.index({location:"2dsphere"})
const PostUser = mongoose.model("Posts_Users",PostUserSchema);

module.exports = PostUser;

// coordinates:[-0.14184,51.50152]

// location:{
//     type:"Point",
//     coordinates:[parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
// }
