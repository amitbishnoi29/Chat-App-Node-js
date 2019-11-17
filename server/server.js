const express = require('express');
const socketIO = require('socket.io');

const moment = require('moment');

const http = require('http');
const path = require('path');

const app = express();

const server = http.createServer(app); // passing express as an argument
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '/../public');

// connecting our socket to the server
const io = socketIO(server);

// -------- middleware -----------
app.use(express.static(publicPath));


io.on('connection', (socket) => {
    console.log('New user connected');

    // ------listen to a createmessage event new message--------
    socket.on('createMessage', function (message, callback) {

        io.to(message.room).emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: moment().valueOf()
        });
        callback();          // this is for acknowlwdgement
    });

    // ---- Handling location Message -------

    socket.on('createLocationMessage', function (coords) {
        io.emit('newLocationMessage', {
            from: 'Anonymus',
            url: `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`,
            createdAt: moment().valueOf()
        });
    });

    // _-------_ JOIN Message -----
    socket.on('join', function (params, callback) {
        if (!(typeof params.name === 'string' && params.name.trim().length > 0)
            || !(typeof params.room === 'string' && params.room.trim().length > 0)) {
            callback('Username and Room name are required');
        }

        socket.join(params.room);
        // scoket.leave('string') leave a room

        // io.emit => io.to('room name').emit
        // socker.broadcast.to('room name').emit()
        // scoket.emit()

        // targetting a specific user
        socket.emit('newMessage', {
            from: 'Admin',
            text: 'Welcome to chat App',
            createdAt: moment().valueOf()
        });

        socket.broadcast.to(params.room).emit('newMessage',{
            from:'Admin',
            text:`${params.name} joined`,
            createdAt:moment().valueOf()
        });
        callback();
    })


    // to emit a event to every connection

    // io.emit('newMessage', {
    //     from: 'Admin',
    //     text: 'Welcome to chat App',
    //     createdAt: moment().valueOf()
    // });

    // to broadcast to everyone except himself

    // socket.broadcast.emit('newMessage', {
    //     text:"this is to every other connection"
    // });


    socket.on('disconnect', function () {
        console.log('User was disconnected');
    });
})
server.listen(port, () => {
    console.log('server is running...');
});
