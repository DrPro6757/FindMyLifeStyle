const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GoogleClientID = '133281800065-7poa50ejkihu4q3bdsej4gs6ifb937mq.apps.googleusercontent.com'
const GoogleSecretId = "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";

passport.use(
    new GoogleStrategy(
        {
            clientID: GoogleClientID,
            clientSecret: GoogleSecretId,
            callbackURL:"/auth/google/callback",
            scope:["profile", "email"],
        },
        function(request, accessToken, refreshToken, profile, callback){
            callback(null,profile);
        }
    )
);

passport.serializeUser((user,done)=>{
    done(null,user)
})

passport.deserializeUser((user,done)=>{
    done(null,user)
})
