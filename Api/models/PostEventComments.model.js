const mongoose = require('mongoose');

const PostEventCommentsSchema = mongoose.Schema({
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

const PostEventComments = mongoose.model("Posts_Events_Comments",PostEventCommentsSchema);

module.exports = PostEventComments;