/**
 * Created by hea on 6/5/18.
 */
//handle chat
const User = require('../models/user');
const Message = require('../models/message');

module.exports = function (io) {

    //map socketid to user
    const userList = {};
    //add namespace chat
    let nsp = io.of('/chat');

    nsp.on('connection', function (socket) {
        console.log('chat user connected');

        socket.on('join', function (params, cb) {
            if(params.sender){
                if(userList[socket.id]){

                }else{
                    userList[socket.id] = params.sender;
                }

                socket.join(params.room);


                nsp.to(params.room).emit('addRoomUser', {user: params.sender});
            }

            /*
             let currentRoomUser = [];
             // console.log(io.to(params.room));
             //current room user already stored in adapter, so we don't need to store somewhere else
             let socketsList = io.sockets.adapter.rooms[params.room].sockets;

             for( let id in socketsList){
             currentRoomUser.push(userList[id]);

             }
             io.to(params.room).emit('getRoomUserList', currentRoomUser);

             */
            /*
             if(params.sender&&params.room){
             socket.room = params.room;
             socket.join(params.room);
             if(userList[params.room]){

             }else{
             userList[params.room] =[];
             }

             let exist = false;
             for(let i=0;i<userList[params.room].length;i++){
             if(userList[params.room][i].id === params.sender.id){
             exist = true;
             }
             }
             if(!exist){
             params.sender.socketid = socket.id;
             userList[params.room].push(params.sender);
             //update user list
             io.to(params.room).emit('getRoomUserList', userList[params.room]);
             }
             console.log(exist);
             console.log(userList);
             cb();
             }
             */

        });
        //no need connect join included
        //first time join room get all current user
        socket.on('fetchRoomUserList', function (message) {
            //console.log('fetch');
            if(message.sender){
                console.log('fetch room:'+message.room);
                let currentRoomUser = [];
                // console.log(io.to(params.room));
                //current room user already stored in adapter, so we don't need to store somewhere else

                //if no namespace
                //let socketsList = io.sockets.adapter.rooms[message.room].sockets;
                let socketsList = nsp.adapter.rooms[message.room].sockets;

                for( let id in socketsList){
                    currentRoomUser.push(userList[id]);
                }
                nsp.to(message.room).emit('getRoomUserList', currentRoomUser);
            }
        });

        socket.on('createMessage', function (message) {
            console.log('createMessage:'+message.text);
            console.log('room:'+message.room);
            nsp.to(message.room).emit('newMessage', {text: message.text, room: message.room,  sender: message.sender});

            if(message.sender){
                const newMessage = new Message();
                newMessage.userId = message.sender.id;
                newMessage.content = message.text;
                newMessage.room = message.room;
                newMessage.save(function (err) {
                    if(err){
                        console.log('save msg err');
                        console.log(err);
                    }
                });
            }

        });

        socket.on('disconnecting', function(){
            console.log('disconneting char');
            console.log(nsp.adapter.sids[socket.id]);
            //if no namespace
            //let room in io.sockets.adapter.sids[socket.id]
            for(let room in nsp.adapter.sids[socket.id] ){
                //leaverooms.push(room);
                nsp.to(room).emit('removeRoomUser', {user: userList[socket.id]});
            }
            /*
            if(userList[socket.id]){
                User.update({'_id':userList[socket.id].id},{isOnline: false},function(err, numAffected) {
                    if(err){
                        console.log('update login err'+err);
                    }

                    console.log('num affect:'+JSON.stringify(numAffected));
                });
            }
            */
        });
        //can't send data when disconnected
        //in disconnect event, the socket already exit the room,
        //so can't get room do it in disconnecting
        //store the room on socket? not sure whether it works and
        socket.on('disconnect', function () {
            console.log('disconnect');
            /*
             leaverooms.forEach(function (item, index, items) {
             let currentRoomUser = [];
             let socketsList = io.sockets.adapter.rooms[item].sockets;
             for( let id in socketsList){
             currentRoomUser.push(userList[id]);

             }
             io.to(item).emit('getRoomUserList', currentRoomUser);
             });

             leaverooms = [];
             */
            /*
             let index = -1;
             console.log('disconnect get all rooms socket in');
             console.log(io.sockets.adapter.sids[socket.id]);

             for(let i=0; i<userList[socket.room].length; i++ ){
             if(userList[socket.room][i].socketid === socket.id){
             index = i;
             }
             }

             console.log('remove user at:'+index);
             if(index>0){
             userList[socket.room].splice(index, 1);
             //update user list
             io.to(message.room).emit('getRoomUserList', userList[socket.room]);
             }
             */
        })

    });


}