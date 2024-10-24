const mongoose = require('mongoose');

const PostReelSchema = mongoose.Schema(
  {
    caption: {
      type: String,
      max: 200,
    },
    username: {
      type: String,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
    reelUrl: {
      type: Array,
      default: [],
      required: true,
    },
    thumbnail: {
      type: String,
      // required:true
    },
    profilePic: {
      type: String,
    },
    gifts: {
      type: Array,
      default: [],
    },
    postLikes: {
      type: Array,
      default: [],
    },
    postComments: {
      type: Array,
      default: [],
    },

    postShares: {
      type: Array,
      default: [],
    },
    email: {
      type: String,
    },
    postDescription: {
      type: String,
    },
    status: {
      type: String,
    },
    fcmTokens: {
      type: Array,
      default: [],
    },
  },
  {timestamps: true},
);
PostReelSchema.index({location: '2dsphere'});
const PostReel = mongoose.model('Posts_Reels', PostReelSchema);

module.exports = PostReel;

// coordinates:[-0.14184,51.50152]

// location:{
//     type:"Point",
//     coordinates:[parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
// }
