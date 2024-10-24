const mongoose = require('mongoose');

const PostEventCommentsSchema = mongoose.Schema(
  {
    comment: {
      type: String,
      max: 1000,
    },
    username: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
    postId: {
      type: String,
      required: true,
    },
    userImage: {
      type: String,
    },
    commentLikes: {
      type: Array,
      default: [],
    },
    Reply: {
      type: Array,
      default: [],
    },
  },
  {timestamps: true},
);

const PostEventComments = mongoose.model(
  'Posts_Events_Comments',
  PostEventCommentsSchema,
);

module.exports = PostEventComments;
