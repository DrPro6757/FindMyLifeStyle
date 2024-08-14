const mongoose = require('mongoose');
const bcrypt = require("bcrypt")

const verficationTokenSchema = mongoose.Schema({
owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User',
    required: true
},
token: {
    type: String,
    required: true,
},
createdAt:{
    type: Date,
    expires: 3600,
    default: Date.now()
}

},
);

verficationTokenSchema.pre('save', async function(next){
    if(this.isModified('token')){
       const hash =  await bcrypt.hash(this.token, 8)
       this.token = hash;
    }

    next();
});

verficationTokenSchema.methods.compareToken = async function(token){
   const result = await bcrypt.compareSync(token, this.token)
   return result;
}

const Token = mongoose.model("verificationToken",verficationTokenSchema);

module.exports = Token;
