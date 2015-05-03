var facebook = require('./facebook');
var twitter = require('./twitter');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user: ');console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            console.log('deserializing user:',user);
            done(err, user);
        });
    });

    // Setting up Passport Strategies for Facebook and Twitter
    facebook(passport);
    twitter(passport);

    passport.use(new LocalStrategy(
      function(username, password, done) {
       
        process.nextTick(function () {
          UserDetails.findOne({'username':username},
            function(err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                if (user.password != password) { return done(null, false); }
                return done(null, user);
            });
        });
      }
    ));

}