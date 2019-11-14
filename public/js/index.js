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

// listener for location
socket.on('newLocationMessage',function(message){
    let li = jQuery('<li></li>');
    let a = jQuery('<a target="_blank">My current location</a>');
    li.text(`${message.from} : `);
    a.attr('href',message.url);
    li.append(a);

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
});

//send location button handler

let locationButton = jQuery('#send-location');
locationButton.on('click',function () {
    if(!navigator.geolocation){
        return alert('Geolocation not supported')
    }
    // diabling button after success case
    locationButton.attr('disabled','disabled').text('Sending location...');
    navigator.geolocation.getCurrentPosition(function (position) {
        // emiting event to server so it can send location to everyone
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        });
    },function(){
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location');
    })
})