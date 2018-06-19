/**
 * Created by hea on 6/5/18.
 */


var express = require('express');
var router = express.Router();
const User = require('../models/user');
const Message = require('../models/message');

router.get('/dashboard/:name', function(req, res, next) {
    console.log(req.params.name);
});


//get user by id
router.post('/user', function(req, res, next) {
    console.log(req.body.id);

    User.findById(req.body.id, function (err, user) {
        if(err){
            console.log('find user by id has err');
            res.json({});
        }else{
            res.json({ user: user});
        }
    });

});

//get most recent 10 message for  a user
router.post('/message', function(req, res, next) {
    console.log(req.body.id);
    if(req.body.id){
        Message.find({userId:req.body.id}).sort({date: -1}).limit(10).exec(function (err,results) {
            if(err){
                console.log('get message err');
                console.log(err);
            }

            res.json({msgs: results});
        });
    }
});


router.get('/logout', function (req, res, next) {
    req.logout();
    console.log('logout');
    console.log(req.user);
    res.json({});
    //res redirect not work when use react route
    //res.redirect('/');
});

module.exports = router;