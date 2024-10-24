const mongoose = require('mongoose');

const PostEventSchema = mongoose.Schema(
  {
    eventName: {
      type: String,
      max: 170,
      required: true,
    },
    caption: {
      type: String,
      max: 200,
    },
    username: {
      type: String,
      //   required: true,
    },
    userCoverPic: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },
    profilePic: {
      type: String,
    },
    imageUrl: {
      type: Array,
      default: [],
      required: true,
      // type:{type:String,required:true},
      // file:[]
    },
    location: {
      type: {type: String, required: true},
      coordinates: [],
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
    caption: {
      type: String,
    },
    email: {
      type: String,
    },
    eventCategory: {
      type: String,
      default: '',
    },
    ticketFreeAmenities: {
      type: String,
      default: '',
    },
    ticket1Amenities: {
      type: String,
      default: '',
    },
    ticket2Amenities: {
      type: String,
      default: '',
    },
    ticket3Amenities: {
      type: String,
      default: '',
    },
    ticket4Amenities: {
      type: String,
      default: '',
    },
    ticket5Amenities: {
      type: String,
      default: '',
    },
    ticket1Price: {
      type: String,
      default: '',
    },
    ticket2Price: {
      type: String,
      default: '',
    },
    ticket3Price: {
      type: String,
      default: '',
    },
    ticket4Price: {
      type: String,
      default: '',
    },
    ticket5Price: {
      type: String,
      default: '',
    },
    ticket1Buyer: {
      type: Array,
      default: [],
    },
    ticket2Buyer: {
      type: Array,
      default: [],
    },
    ticket3Buyer: {
      type: Array,
      default: [],
    },
    ticket4Buyer: {
      type: Array,
      default: [],
    },
    ticket5Buyer: {
      type: Array,
      default: [],
    },
    eventType: {
      type: String,
      default: '',
    },
    viewPermission: {
      type: Array,
      default: [],
    },

    importantNote: {
      type: String,
      max: 200,
      default: '',
    },
    eventStartDate: {
      type: String,
      default: '',
    },
    eventDate: {
      type: String,
      default: '',
    },
    eventEndDate: {
      type: String,
      default: '',
    },
    eventDays: {
      type: String,
      default: '',
    },
    eventTime: {
      type: String,
      max: 200,
      default: '',
    },
    eventStartTime: {
      type: String,
      max: 200,
      default: '',
    },
    eventEndTime: {
      type: String,
      max: 200,
      default: '',
    },
    eventDescription: {
      type: String,
      default: '',
    },
    eventJoinRequests: {
      type: Array,
      default: [],
    },
    eventMembersList: {
      type: Array,
      default: [],
    },
    gender: {
      type: String,
      default: '',
    },
    interest: {
      type: String,
      default: '',
    },
    level: {
      type: String,
      default: '',
    },
    rank: {
      type: Number,
      default: 0,
    },
    members: {
      type: Number,
      default: 0,
    },
    postTimeData: {
      type: String,
      default: '',
    },
    userImage: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: '',
    },
    fcmTokens: {
      type: Array,
      default: [],
    },
  },
  {timestamps: true},
);
PostEventSchema.index({location: '2dsphere'});
// PostEventSchema.index({ticket1Buyer:"2dsphere"})

const PostEvent = mongoose.model('Posts_Events', PostEventSchema);

module.exports = PostEvent;

// coordinates:[-0.14184,51.50152]

// location:{
//     type:"Point",
//     coordinates:[parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
// }
// {path: '', fileType:''}
