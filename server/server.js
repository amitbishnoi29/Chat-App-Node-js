const express = require('express');
const socketIO = require('socket.io');

const http = require('http');
const path = require('path');

const app = express();

const server = http.createServer(app); // passing express as an argument
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,'/../public');

// connecting our socket to the server
const io = socketIO(server);

//middleware
app.use(express.static(publicPath));


io.on('connection',function(socket) {
    console.log('New user connected');

    //listen to a new message
    socket.on('createMessage',function(message,callback){
        console.log(message);
        callback('this is acknowledgement') ;          // this is for acknowlwdgement
    });

    //emit a new message to client

    socket.emit('newMessage',{
        text:'new message'
    });

    // to emit a event to every connection

    // io.emit('newMessage',{
    //     text:'this is to every user'
    // });

    // to broadcast to everyone except himself

    // socket.broadcast.emit('newMessage',{
    //     text:"this is to every other connection"
    // });


    socket.on('disconnect',function(){
        console.log('User was disconnected');
    });
})
server.listen(port,() => {
    console.log('server is running...');
});
