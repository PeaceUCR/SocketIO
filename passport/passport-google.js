/**
 * Created by hea on 5/30/18.
 */

const passport = require('passport');
const User = require('../models/user');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const secret = require('../secret/secrets');

//config as http://www.passportjs.org/docs/username-password/
passport.serializeUser(function (user, done) {
    done(null, user.id);
});


passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    })
});

//after passport authenticate success, the user information can get directly from req.user
//http://www.passportjs.org/docs/login/
passport.use(new GoogleStrategy({
    clientID: secret.google.clientID,
    clientSecret: secret.google.clientSecret,
    profileFields: ['email', 'displayName', 'photos'],
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
},function (req, token, refreshToken, profile, done) {
    console.log(profile);
    User.findOne({google: profile.id},function(err, user){
        if(err){
            return done(err);
        }

        if(user){
            return done(null, user);
        }else{
            const newUser = new User();
            newUser.google = profile.id;
            newUser.username = profile.displayName;
            newUser.email = profile.emails[0].value;
            newUser.userImage = profile._json.image.url;


            newUser.save(function (err) {
                if(err){
                    return done(err);
                }
                return done(null, newUser);
            })
        }
    });
}));