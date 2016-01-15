// IdroServer System 1.0
// Copyright (c) 2016 EstiNet
var http = require('http');
var events = require('events');
var eventEmitter = new events.EventEmitter();

console.log('Starting IdroServer System 1.0');

var server = http.createServer(function(req, res){
});

var io = require('socket.io').listen(server);

var serverdata = 'Doi';

io.sockets.on('connection', function(socket) { 

    console.log('Client connection initilizaed.');

    // Disconnect listener
    socket.on('disconnect', function() {
        console.log('Client disconnected.');
    });

    socket.on('MinigameUpdate', function (data, fn) {
        //console.log(data);
        console.log('\tSending minigame update to hub servers.');
        //fn('\tMinigame-CTF-GameInProgress-No');
		fn('\tDataRecived');
		serverdata = data;
		console.log(serverdata)
		eventEmitter.emit('MinigameUpdate');
    });

});

var minigameUpdate = function minigameUpdate(){
	console.log('Woot woot stuff happens!')
}

eventEmitter.on('MinigameUpdate', minigameUpdate);

server.listen(8080);