/**
 * Created by hea on 6/12/18.
 */
//socket handle notification like friend request

const User = require('../models/user');

module.exports = function (io) {

    //map userid to socketid
    const socketList = {};
    //add namespace chat
    let nsp = io.of('/notification');

    nsp.on('connection', function (socket) {
        console.log('notification user connected');

        socket.on('join', function (params) {
            console.log('join notification');
            console.log(params);
            if (params.sender) {
                socketList[params.sender.id] = socket.id;
            }
        });

        socket.on('sendRequest', function (data) {
            console.log('send friend request');
            //console.log(data.sender);
            //console.log(data.target);
            //socket.emit('getRequest',{type: 'friend request',sender: data.sender});
            //send to individual client


            socket.broadcast.to(socketList[data.target._id]).emit('getRequest',{type: 'Friend request',sender: data.sender});

            User.findOne({'_id':data.target._id},function (err, user) {
                let requests = user.request||[];
                requests.push({type: 'Friend request',sender: data.sender});
                User.update({'_id':data.target._id},{request: requests},function(err, numAffected) {
                    if(err){
                        console.log('update login err'+err);
                    }
                    console.log('num affect:'+JSON.stringify(numAffected));
                });
            });

        });


        socket.on('disconnecting', function(){
            console.log('disconneting notification');
            //if no namespace
            //let room in io.sockets.adapter.sids[socket.id]

            for(let key in socketList){
                if(socketList[key] ===socket.id){
                    User.update({'_id':key},{isOnline: false},function(err, numAffected) {
                        if(err){
                            console.log('update login err'+err);
                        }

                        console.log('num affect:'+JSON.stringify(numAffected));
                    });
                }
            }

        });

    });


}