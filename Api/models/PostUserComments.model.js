const mongoose = require('mongoose');

const PostUserCommentsSchema = mongoose.Schema(
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
  },
  {timestamps: true},
);

const PostUserComments = mongoose.model(
  'Posts_Users_Comments',
  PostUserCommentsSchema,
);

module.exports = PostUserComments;
