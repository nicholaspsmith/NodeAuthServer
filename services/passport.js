const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local strategy
const localOptions = { usernameField: 'email' }; // it expects 'username' by default, so we specify we're using 'email'
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // verify this email and password, call done with user
  // if it is the correct email and password
  // otherwise, call done with false
  User.findOne({ email: email }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    // Check password - is supplied 'password' equal to stored pw
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    });
  })
});

// Set up options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // See if the user ID in the payload exists in DB
  User.findById(payload.sub, function(err, user) {
    if (err) {
      // there was an error, return the error and 'false' for user
      return done(err, false);
    }

    if (user) {
      // success: return null (no error) and user object
      done(null, user);
    } else {
      // no user & no error: return null and 'false' for user
      done(null, false);
    }

  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
