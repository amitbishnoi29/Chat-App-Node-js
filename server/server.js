const express = require('express');
const socketIO = require('socket.io');

const moment = require('moment');
const http = require('http');
const path = require('path');

const app = express();

const { Users } = require('./utils/users');

const server = http.createServer(app); // passing express as an argument
const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '/../public');
// ---------- creating new instance of user
const users = new Users();

// connecting our socket to the server
const io = socketIO(server);

// -------- middleware -----------
app.use(express.static(publicPath));


io.on('connection', (socket) => {
    console.log('New user connected');

    // ------listen to a createmessage event new message--------
    socket.on('createMessage', function (message, callback) {
        let user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newMessage', {
                from: user.name,
                text: message.text,
                createdAt: moment().valueOf()
            });
            callback(); // this is for acknowlwdgement
        }


    });

    // ---- Handling location Message -------

    socket.on('createLocationMessage', function (coords) {
        let user = users.getUser(socket.id);

        if (user) {
            io.to(user.room).emit('newLocationMessage', {
                from: user.name,
                url: `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`,
                createdAt: moment().valueOf()
            });
        }

    });

    // _-------_ JOIN Message -----
    socket.on('join', function (params, callback) {
        if (!(typeof params.name === 'string' && params.name.trim().length > 0)
            || !(typeof params.room === 'string' && params.room.trim().length > 0)) {
            return callback('Username and Room name are required');


        }
        // ---- checking is user already exist ----
        let users1 = users.getUserList(params.room.trim().toLowerCase());
        let checkUserExist = true;
        users1.forEach(user => {
            if (user.trim().toLowerCase() === params.name.trim().toLowerCase()) {
                checkUserExist = false;
                return callback(`User with username ${params.name} already exist. Please choose a different username.`);
            }
        });


        // emmiting updated users List to client
        if (checkUserExist) {
            params.room = params.room.trim().toLowerCase();
            socket.join(params.room);
            // scoket.leave('string') leave a room

            users.removeUser(socket.id);
            users.addUser(socket.id, params.name.trim(), params.room);
            io.to(params.room).emit('updatedUserList', users.getUserList(params.room));

            // io.emit => io.to('room name').emit
            // socker.broadcast.to('room name').emit()
            // scoket.emit()

            // targetting a specific user
            socket.emit('newMessage', {
                from: 'Admin',
                text: 'Welcome to chat App',
                createdAt: moment().valueOf()
            });

            socket.broadcast.to(params.room).emit('newMessage', {
                from: 'Admin',
                text: `${params.name} joined`,
                createdAt: moment().valueOf()
            });
        }

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
        let user = users.removeUser(socket.id);

        if (user) {
            // to send the newly updated list of users if any user left
            io.to(user.room).emit('updatedUserList', users.getUserList(user.room));

            // notifies everyone in the  room that user has left
            io.to(user.room).emit('newMessage', {
                from: 'Admin',
                text: `${user.name} has left.`,
                createdAt: moment().valueOf()
            });
        }
    });
})
server.listen(port, () => {
    console.log('server is running...');
});
