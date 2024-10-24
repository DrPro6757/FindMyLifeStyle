const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: {
        type : String,
        default : ""
    },
    imageUrl: {
        type : String, 
        default : ""
    },
    videoUrl: {
        type : String,
        default : ""
    },
    seen : {
        type : Boolean,
        default : false
    },msgByUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Users'
    }
},
{timestamps:true}
);

const ConversationSchema = mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Users'
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'Users'
    },
    conversationId:{
        type : String,
        required : true
    },
    messageType:{
        type: String,
        enum:['text', 'media']
    },
    // message:{
    //     type: String,
    //     required: true
    //     }
    // ,
    timeStamp:{
        type: Date,
        default: Date.now,
    },
    messages:[
        {
        type: mongoose.Schema.ObjectId,
        ref : 'Message'
        }
    ]
},
{timestamps:true}
);



const MessageModel = mongoose.model("Message",messageSchema);

const ConversationModel = mongoose.model("Conversation",ConversationSchema);

module.exports = //ConversationModel
{
    MessageModel,
    ConversationModel
}
