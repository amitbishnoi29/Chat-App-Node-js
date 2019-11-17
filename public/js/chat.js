let socket = io();

// scroling to bottom

function scrollToBottom() {
    let messages = jQuery('#messages');
    let newMessage = messages.children('li:last-child');
    // Heights
    let clientHeight = messages.prop('clientHeight');
    let scrollTop = messages.prop('scrollTop');
    let scrollHeight = messages.prop('scrollHeight');

    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight +
        lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

// ---------- after successful connection ----------
// ---------- CREATING ROOM ----------------
socket.on('connect', function () {
    console.log('Connected to server');
    const params = jQuery.deparam(window.location.search);
    console.log(params); 

    // --- emmiting an event to server ----
    socket.emit('join',params,function(err){
        if(err) {
            alert(err);
            window.location.href='/';
        } else {
            console.log('No error');
        }
    })
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
    scrollToBottom();
});

// listener for location
socket.on('newLocationMessage', function (message) {
    const time = moment(message.createdAt).format("h:mm a");
    let template = jQuery('#location-message-template').html()
    let html = Mustache.render(template, {
        url: message.text,
        from: message.from,
        time: time
    })

    jQuery('#messages').append(html);
    scrollToBottom();
});

socket.on('disconnect', function () {
    console.log('disconnected from server');
});

socket.on('updatedUserList',function(users){
    let ol = jQuery('<ol></ol>');

    users.forEach(function (user) {
        console.log(user);
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
})

// ---------- form submition -------
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