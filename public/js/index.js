
let socket = io();

socket.on('connect', function () {
    console.log('Connected to server');
});

//listen to a new message from server

socket.on('newMessage', function (message) {
    let time = moment(message.createdAt).format("h:mm a");
    // creating a new element with message in it
    let template = jQuery('#message-template').html()
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        time: time
    });
    jQuery('#messages').append(html);
});

// listener for location
socket.on('newLocationMessage', function (message) {
    let time = moment(message.createdAt).format("h:mm a");
    let template = jQuery('#location-message-template').html()
    let html = Mustache.render(template,{
        url:message.text,
        from:message.from,
        time:time
    })

    jQuery('#messages').append(html);
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
    }, function () {   //acknowledgement
        
        jQuery('#message-input').val('');
        
    });
});

//send location button handler

let locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported')
    }
    // diabling button after success case
    locationButton.attr('disabled', 'disabled').text('Sending location...');
    navigator.geolocation.getCurrentPosition(function (position) {
        // emiting event to server so it can send location to everyone
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function () {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location');
    })
})