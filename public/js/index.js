let socket = io();

socket.on('connect', function () {
    console.log('Connected to server');
});

//listen to a new message from server

socket.on('newMessage', function (message) {
    console.log(message);
    // creating a new element with message in it

    let li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages').append(li);
});

socket.on('disconnect', function () {
    console.log('disconnected from server');

});


jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();
    // emit an event
    socket.emit('createMessage', {
        from: 'User',
        text: jQuery('[name=message]').val()
    }, function (data) {   //acknowledgement
        console.log(data);
       
       document.getElementById('message').value='';
       ;
    });
    //console.log('After emiting');
    
});