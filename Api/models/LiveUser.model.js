const mongoose = require('mongoose');

const LiveUserSchema = mongoose.Schema(
  {
    liveId: {
      type: String,
      required: true,
    },
    streamCaption: {
      type: String,
      max: 100,
    },
    streamName: {
      type: String,
      required: true,
    },
    streamLive: {
      type: Boolean,
      required: true,
    },

    streamCategory: {
      type: String,
      required: true,
    },
    streamAudience: {
      type: Array,
      default: [],
    },
    streamGifts: {
      type: Array,
      default: [],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
    liveScore: {
      type: String,
    },
    leaderBoard: {
      type: String,
    },
    favourites: {
      type: Array,
      default: [],
    },
    wallet: {
      type: String,
    },
    fanClub: {
      type: Array,
      default: [],
    },
    gaurdrians: {
      type: Array,
      default: [],
    },
    imageUrl: {
      type: String,
    },
    location: {
      type: {type: String},
      coordinates: [],
    },
    streamLikes: {
      type: Array,
      default: [],
    },
    streamShares: {
      type: Array,
      default: [],
    },
    streamDuration: {
      type: String,
    },
  },
  {timestamps: true},
);
LiveUserSchema.index({location: '2dsphere'});
const LiveUser = mongoose.model('Live_Users', LiveUserSchema);

module.exports = LiveUser;

// coordinates:[-0.14184,51.50152]

// location:{
//     type:"Point",
//     coordinates:[parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
// }
