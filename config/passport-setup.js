const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy=require('passport-github2').Strategy;
const keys = require('./keys');
const User = require('../models/user-model');
const githubUser = require('../models/github-model');

passport.serializeUser((user, done) => {
    //console.log(user);
    done(null, user);
});

passport.deserializeUser((user, done) => {
    //console.log(user);
    if(user.googleId){
        User.findById(user._id).then((user) => {
            done(null, user);
        });
    }
    else{
        githubUser.findById(user._id).then((user) => {
            done(null, user);
        });
    }
    
});


passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {

        //console.log(profile);
        // check if user already exists in our own db
        User.findOne({googleId: profile.id}).then((currentUser) => {
            if(currentUser){
                // already have this user
                console.log('user is: ', currentUser);
                done(null, currentUser);
            } else {
                // if not, create user in our db
                new User({
                    googleId: profile.id,
                    username: profile.displayName,
                    thumbnail:profile._json.picture
                }).save().then((newUser) => {
                    console.log('created new user: ', newUser);
                    done(null, newUser);
                });
            }
        });
    })
);

// Github Strategy
passport.use(new GitHubStrategy({
    clientID: keys.github.clientID,
    clientSecret: keys.github.clientSecret,
    callbackURL: '/auth/github/redirect'
  },
  (accessToken, refreshToken, profile, done) => {

    //console.log(profile);
    //check if user already exists in our own db
    githubUser.findOne({githubId: profile.id}).then((currentUser) => {
        if(currentUser){
            // already have this user
            console.log('user is: ', currentUser);
            done(null, currentUser);
        } else {
            // if not, create user in our db
            new githubUser({
                username: profile.username,
                githubId: profile.id,
                thumbnail:profile.photos[0].value
            }).save().then((newUser) => {
                console.log('created new user: ', newUser);
                done(null, newUser);
            });
        }
    });
})
);

