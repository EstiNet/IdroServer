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

//Get the current date+time
function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}
function logConsole(logtext, level) {
	//Return a stylized console log.
	//DEBUG is 0
	//ERROR is 1
	//WARNING is 2
	//INFO is 3
	
	switch(level) {
		case 0:
			loglevel = 'DEBUG';
		case 1:
			loglevel = 'ERROR';
		case 2:
			loglevel = 'WARNING';
		case 3:
			loglevel = 'INFO';
	}
	return '[' + getDateTime() + ']' + '[' + loglevel + ']' + ' ' + logtext;
}
io.sockets.on('connection', function(socket) { 

    console.log(logConsole('Client connection initilizaed.', 3));

    // Disconnect listener
    socket.on('disconnect', function() {
        console.log(logConsole('Client disconnected.', 3));
    });

    socket.on('MinigameUpdate', function (data, fn) {
        //console.log(data);
        console.log(logConsole('\tSending minigame update to hub servers:', 3));
        //fn('\tMinigame-CTF-GameInProgress-No');
		fn('\tDataRecived');
		serverdata = data;
		console.log(logConsole('\t' + serverdata, 3));
		if(serverdata == 'MG-CTF 1 state inprog'){
			console.log(logConsole('CTF Minigame, Server 1, is now in progress!', 3));
		}
		eventEmitter.emit('MinigameUpdate');
    });

});

var minigameUpdate = function minigameUpdate(){
	console.log(logConsole('minigameUpdate event recived!', 0));
}

eventEmitter.on('MinigameUpdate', minigameUpdate);
console.log(logConsole('This is a test message! woot!', 3));
server.listen(8080);