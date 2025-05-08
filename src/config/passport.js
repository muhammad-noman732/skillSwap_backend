const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../models/UserModal");

//  google config strategy
passport.use(new GoogleStrategy({
  // jb user login kre ga to wha se google user callbackurl ki trf redirect krege with profile and token
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL  
  },

  //  callback m info of user aye gi 
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        // Create new user
        user = await User.create({
          userName: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
        });
      }

      // Pass user to next step
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

