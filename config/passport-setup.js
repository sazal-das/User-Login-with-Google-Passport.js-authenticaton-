const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user-model');

//serialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

//deserialize user
passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        //options for the google strategy
        callbackURL: '/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret
    }, (acceddToken, refreshToken, profile, done) => {
        //passport callback function
        //console.log(profile); 
        //console.log('You reached the callback function');

        //Check if the user already exists on our db
        User.findOne({ googleID: profile.id }).then((currentUser) => {
            if (currentUser) {
                console.log('User is ' + currentUser);
                done(null, currentUser);
            }
            else {
                const user = new User({
                    username: profile.displayName,
                    googleID: profile.id,
                    thumblin: profile._json.picture
                }).save().then((user) => {
                    console.log('New User is inserted ' + user);
                    done(null, user);

                });
            }
        });


    })
);