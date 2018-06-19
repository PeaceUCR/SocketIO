/**
 * Created by hea on 5/29/18.
 */

const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

////config as http://www.passportjs.org/docs/username-password/
passport.serializeUser(function (user, done) {
    done(null, user.id);
});


passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    })
});
//first argument just a name of it, use in controller
//http://www.passportjs.org/docs/authorize/
//In this case, a named strategy can be used, by overriding the strategy's default name in the call to use()
//http://www.passportjs.org/docs/username-password/
//passReqToCallback: true, otherwise the req will not avail in callback localstrategy
//http://www.passportjs.org/docs/authorize/
////after passport authenticate success, the user information can get directly from req.user
//http://www.passportjs.org/docs/login/
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    User.findOne({'email':email},function (err, user) {
        if(err){
            return done(err);
        }

        console.log('Iam signup passport');
        console.log(req.body);

        if(user){
            return done(null, false, req.flash('error', 'User with email already exist'));
        }

        const newUser = new User();
        newUser.username = req.body.username;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);
        console.log(newUser.password);
        newUser.save(function (err) {
            done(null, newUser);
        })
    });
}));


passport.use('local.login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    console.log('Iam login passport');
    console.log(req.body);

    User.findOne({'email':email},function (err, user) {
        if(err){
            return done(err);
        }
        console.log(user);

        if(!user || !user.validatePassword(password)){
            return done(null, false, req.flash('error', 'Email not exist or password invalid'));
        }

        if(user.isOnline){
            console.log('you already login at somewhere else');
        }

        User.update({'email':email},{lastLogin: new Date(), isOnline: true},function(err, numAffected) {
            if(err){
                console.log('update login err'+err);
            }

            console.log('num affect:'+JSON.stringify(numAffected));
        });
        return done(null, user);
    });
}));