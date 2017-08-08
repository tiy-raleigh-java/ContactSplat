const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// my user model
const User = require('../models/model').User;

let configuredPassport;

if (!configuredPassport) {
  passport.use(
    new LocalStrategy((emailAddress, password, done) => {
      User.authenticate(emailAddress, password)
        // auth succeeded
        .then(user => {
          if (!user) {
            done(null, null, {
              message: 'There is no user with that username and password',
              emailAddress: emailAddress
            });
          } else {
            done(null, user);
          }
        })
        .catch(err => done(err, null));
    })
  );

  // stores the user's ID in the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // gets the user's ID from the session and looks them up again
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  configuredPassport = passport;
}

module.exports = configuredPassport;
