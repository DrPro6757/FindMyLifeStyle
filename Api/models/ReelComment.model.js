const mongoose = require('mongoose');

const ReelCommentsSchema = mongoose.Schema(
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

const ReelComments = mongoose.model('Reels_Comments', ReelCommentsSchema);

module.exports = ReelComments;
