const mongoose = require('mongoose');
const messageSchema = mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
    // conversationId:{
    //     type : String,
    //     required : true
    // },
    // messageType:{
    //     type: String,
    //     enum:['text', 'media']
    // },
    message: {
      type: String,
      required: true,
    },
  },
  {timestamps: true},
);

const MessageModel = mongoose.model('MessageUsers', messageSchema);

module.exports = MessageModel;
