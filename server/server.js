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
    socket.on('createMessage',function(message){
        console.log(message); 
        //socket.emit('newMessage',message);
    });

    //emit a new message to client

    socket.emit('newMessage',{
        text:'new message'
    });

    socket.on('disconnect',function(){
        console.log('User was disconnected');
    });
})
server.listen(port,() => {
    console.log('server is running...');
});
