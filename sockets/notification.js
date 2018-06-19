/**
 * Created by hea on 6/12/18.
 */
//socket handle notification like friend request

const User = require('../models/user');

module.exports = function (io) {

    //map socketid to user
    const userList = {};
    //add namespace chat
    let nsp = io.of('/notification');

    nsp.on('connection', function (socket) {
        console.log('notification user connected');

        socket.on('sendRequest', function (data) {
            console.log('send friend request');
            console.log(data.sender);
            console.log(data.target);
        })

    });


}