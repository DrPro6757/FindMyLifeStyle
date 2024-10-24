const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      max: 40,
      // required:[true, "Please enter name"]
    },

    email: {
      type: String,
      // required:[true, "Please enter email"],
      unique: true,
    },
    phone: {
      type: Number,
      unique: true,
    },
    password: {
      type: String,
      // required:true
    },
    mobile: {
      type: String,
      max: 50,
      // required:true,
      // unique:true
    },
    gender: {
      type: String,
      max: 50,
      // required:true
    },
    dob: {
      type: String,
      max: 50,
      // required:true
    },
    address: {
      type: String,
      max: 100,
    },
    profilePic: {
      type: String,
      default: '',
    },
    coverPic: {
      type: String,
      default: '',
    },
    followRequests: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Users',
    },

    sentFollowingRequests: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
    EventsWishList: {
      type: Array,
      default: [],
    },
    SavedPosts: {
      type: Array,
      default: [],
    },
    about: {
      type: String,
      max: 70,
    },
    age: {
      type: Number,
      default: 0,
    },
    chatsBy: {
      type: Array,
      default: [],
    },
    education: {
      type: String,
      max: 50,
    },
    eventsJoined: {
      type: Array,
      default: [],
    },
    eventsPosted: {
      type: Number,
      default: 0,
    },
    fcmToken: {
      type: String,
      default: '',
    },
    interest: {
      type: String,
      default: '',
    },
    messageFrom: {
      type: Array,
      default: [],
    },
    myLikedEvents: {
      type: Array,
      default: [],
    },
    myLocation: {
      type: Array,
      coordinates: [-74.006, 40.7128],
    },
    photos: {
      type: Array,
      default: [],
    },
    profileLikes: {
      type: Array,
      default: [],
    },
    relationshipStatus: {
      type: String,
      default: '',
    },
    onlineStatus: {
      type: Boolean,
      default: true,
    },
    work: {
      type: String,
      max: 70,
      default: '',
    },
    signUpType: {
      type: String,
      required: true,
    },
    OTP: {
      type: Number,
      // required:true
    },
    verifiedEmail: {
      type: Boolean,
    },
    verifiedPhone: {
      type: Boolean,
    },
    twoStepAuth: {
      type: Boolean,
    },
  },
  {timestamps: true},
);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hash = await bcrypt.hash(this.password, 8);
    this.password = hash;
  }

  next();
});

// later
UserSchema.methods.comparePassword = async function (password) {
  const result = await bcrypt.compareSync(password, this.password);
  return result;
};

const User = mongoose.model('Users', UserSchema);

module.exports = User;
