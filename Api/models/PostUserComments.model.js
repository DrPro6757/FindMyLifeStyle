const mongoose = require('mongoose');

const PostUserCommentsSchema = mongoose.Schema({
    comment:{
        type:String,
        max:1000
    },
    username:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    postId:{
        type:String,
        required:true
    }
   

},
{timestamps:true}
);

const PostUserComments = mongoose.model("Posts_Users_Comments",PostUserCommentsSchema);

module.exports = PostUserComments;