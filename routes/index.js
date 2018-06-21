var express = require('express');
var router = express.Router();
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const User = require('../models/user');

//https://stackoverflow.com/questions/7083045/fs-how-do-i-locate-a-parent-folder
//https://stackoverflow.com/questions/43411635/react-router-not-working-when-deployed
router.get(['/gate','/user/*','/room/*'], function(req, res, next) {
    res.sendFile(path.resolve(__dirname +'/../public/index.html'));
});



/* GET home page. */
/*
router.get('/login', function(req, res, next) {
    const errMsg = req.flash('error');
    console.log(errMsg);
  res.render('login', {error: errMsg[0]});
});


router.get('/signup', function(req, res, next) {
    const errMsg = req.flash('error');
    console.log(errMsg);
    res.render('signup', {error: errMsg});
});
*/
/*
router.get('/home', function(req, res, next) {
    console.log(req.user);
    res.render('home');
});
*/
//get current user from session
router.get('/currentuser', function(req, res, next) {
    console.log(req.user);
    if(req.user){
        User.update({'email':req.user.email},{isOnline: true},function(err, numAffected) {
            if(err){
                console.log('update login err'+err);
            }

            console.log('num affect:'+JSON.stringify(numAffected));
        });

        res.json({ user: {id: req.user.id,username:req.user.username, userImage: req.user.userImage,request: req.user.request} });
    }else{
        res.json({});
    }
});

//set custom json response instead of redirect
/*
router.post('/login', passport.authenticate('local.login', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash: true
}));
*/


/*
 router.post('/signup', passport.authenticate('local.signup', {
 successRedirect: '/',
 failureRedirect: '/signup',
 failureFlash: true
 }));
 */

//https://stackoverflow.com/questions/15388206/sending-back-a-json-response-when-failing-passport-js-authentication
router.post('/login',
    passport.authenticate('local.login', {failWithError: true}),
    function (req, res, next) {
        // handle success
        console.log(req.xhr);
        if (req.xhr) { return res.json({ user: {id: req.user.id,username:req.user.username, userImage: req.user.userImage, request: req.user.request}}); }
        return res.redirect('/');
    },
    function (err, req, res, next) {
        // handle error/fail
        //login fail will send err, ui need to handleerr
        console.log('show err'+err);
        console.log('is xhr?'+req.xhr);

        const errMsg = req.flash('error');
        console.log('show flash '+errMsg);
        console.log(typeof errMsg);
        if (req.xhr) { return errMsg?res.status(200).json(errMsg):res.status(500).json(err); }
        return res.redirect('http://localhost:3000/login');
    });


router.post('/signup',
    passport.authenticate('local.signup', {failWithError: true}),
    function (req, res, next) {
        // handle success
        console.log(req.xhr);
        if (req.xhr) { return res.json({ msg: 'sign up success' }); }
        return res.redirect('http://localhost:3000/login');
    },
    function (err, req, res, next) {
        // handle error/fail
        //login fail will send err, ui need to handleerr
        console.log(err);
        console.log(req.xhr);

        const errMsg = req.flash('error');
        console.log(errMsg);

        if (req.xhr) { return errMsg?res.status(200).json(errMsg):res.status(500).json(err); }
        return res.redirect('http://localhost:3000/register');
    });

//go google auth
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

//after auth
router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/room/private',
    failureRedirect: '/gate',
    failureFlash: true
}));


//upload
router.post('/uploadFile', function (req, res, next) {
    const  formidable = require('formidable');
    const  form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../public/uploads');
    
    form.on('file', function(field, file){
       fs.rename(file.path , path.join(form.uploadDir, file.name), function (err) {
           if(err) throw error;
           console.log('file rename success');
       }) 
    });

    form.on('errpr', function (err) {
        console.log(err);
    });

    form.on('end', function () {
        console.log('upload success');
    })

    form.parse(req);
})
module.exports = router;
