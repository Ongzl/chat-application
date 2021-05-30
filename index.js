/*
 *  (C) 2018, All rights reserved. This software constitutes the trade secrets and confidential and proprietary information
 *  It is intended solely for use by Sandip Salunke. This code may not be copied or redistributed to third parties without
 *  prior written authorization from Sandip Salunke
 */



// var firebase = require("firebase/app");
// require("firebase/auth");

var app = require('express')();
var express=require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
// var firebase = require("firebase/app");
//
//
// var firebaseConfig = {
//     apiKey: "AIzaSyA-bROuQeYtw5ZtdGJVGyPtRmiemm7466I",
//     authDomain: "chatella-1e8ab.firebaseapp.com",
//     projectId: "chatella-1e8ab",
//     storageBucket: "chatella-1e8ab.appspot.com",
//     messagingSenderId: "998337225486",
//     appId: "1:998337225486:web:511c2d7ff5d09db7802d5f",
//     measurementId: "G-L6JY0BD56M"
// };
// firebase.initializeApp(firebaseConfig);
//
// // var person = user.displayName;
// // exports.name = person;
// module.exports = handleGoogleSignIn = (firebase) => {
//     const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
//     firebase.auth().signInWithPopup(googleAuthProvider).then((result) => {
//         var user = result.user;
//     });
// ;
// };

var onlineUsers = [];

// Initialize appication with route / (that means root of the application)
app.get('/', function(req, res){
    var express=require('express');
    app.use(express.static(path.join(__dirname)));
    res.sendFile(path.join(__dirname, '../chat-application', 'index.html'));
});

// // All other GET requests not handled before will return Chat app
// app.get('*', function(req, res){
//     var express=require('express');
//     app.use(express.static(path.join(__dirname)));
//     res.sendFile(path.join(__dirname, '../chat-application', 'index.html'));
// });
//
// // Have Node serve the files for our built React app
 app.use(express.static(path.resolve(__dirname, '../front_end/build')));

// Register events on socket connection
io.on('connection', function(socket){

    // Listen to chantMessage event sent by client and emit a chatMessage to the client
    socket.on('chatMessage', function(message){
        io.to(message.receiver).emit('chatMessage', message);
    });

    // Listen to notifyTyping event sent by client and emit a notifyTyping to the client
    socket.on('notifyTyping', function(sender, receiver){
        io.to(receiver.id).emit('notifyTyping', sender, receiver);
    });

    // Listen to newUser event sent by client and emit a newUser to the client with new list of online users
    socket.on('newUser', function(user){
        var newUser = {id: socket.id, name: user};
        onlineUsers.push(newUser);
        io.to(socket.id).emit('newUser', newUser);
        io.emit('onlineUsers', onlineUsers);
    });

    // Listen to disconnect event sent by client and emit userIsDisconnected and onlineUsers (with new list of online users) to the client
    socket.on('disconnect', function(){
        onlineUsers.forEach(function(user, index){
            if(user.id === socket.id) {
                onlineUsers.splice(index, 1);
                io.emit('userIsDisconnected', socket.id);
                io.emit('onlineUsers', onlineUsers);
            }
        });
    });

});

// Listen application request on port 3000
http.listen(9000, function(){
    console.log('listening on *:9000');
});