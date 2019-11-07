let socket = io();

socket.on('connect', function () {
    console.log('connected to server');

    //creating a message
    
});

//listen to a new message from server

socket.on('newMessage',function(message){
    console.log(message);
});

socket.emit('createMessage',{
    text:'New Message',
    from : 'abc@gmail.com',
    time : 123
},function(data){            // this is third argument for acknowlwdgement
    console.log('got it',data); 
});

socket.on('disconnect', function () {
    console.log('disconnected from server');

})