// IdroServer System 2.0 - ALPHA
// Copyright (c) 2016 EstiNet
var net = require('net');
var events = require('events');
var eventEmitter = new events.EventEmitter();

var port = 6000;
var versionFull = "2.0 Alpha"
var versionNumber = 2.1;

var NodeRSA = require('node-rsa');
console.log(logConsole('Loading RSA key...', 3));
//Change this key in production use!
var key = new NodeRSA('-----BEGIN RSA PRIVATE KEY-----\n'+
                      'MIIBOQIBAAJAVY6quuzCwyOWzymJ7C4zXjeV/232wt2ZgJZ1kHzjI73wnhQ3WQcL\n'+
                      'DFCSoi2lPUW8/zspk0qWvPdtp6Jg5Lu7hwIDAQABAkBEws9mQahZ6r1mq2zEm3D/\n'+
                      'VM9BpV//xtd6p/G+eRCYBT2qshGx42ucdgZCYJptFoW+HEx/jtzWe74yK6jGIkWJ\n'+
                      'AiEAoNAMsPqwWwTyjDZCo9iKvfIQvd3MWnmtFmjiHoPtjx0CIQCIMypAEEkZuQUi\n'+
                      'pMoreJrOlLJWdc0bfhzNAJjxsTv/8wIgQG0ZqI3GubBxu9rBOAM5EoA4VNjXVigJ\n'+
                      'QEEk1jTkp8ECIQCHhsoq90mWM/p9L5cQzLDWkTYoPI49Ji+Iemi2T5MRqwIgQl07\n'+
                      'Es+KCn25OKXR/FJ5fu6A6A+MptABL3r8SEjlpLc=\n'+
                      '-----END RSA PRIVATE KEY-----');
console.log(logConsole('Done loading RSA Key!', 3));

console.log(logConsole('Starting IdroServer System ' + versionFull + '...', 3));

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

//Old code from System 1.0
/*
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
*/

var server = net.createServer(function (c)
{ //'connection' listener
    console.log(logConsole('Client connection initilizaed.', 3));
	
    c.on('data', function (rawData)
    {
        console.log(logConsole(rawData, 0));   
		
		//Convert incoming data to string.
		var data = rawData.toString('utf-8');
		
		//console.log(key); nope this doesnt work
		var encrypted = key.encrypt(rawData, 'base64');
		console.log('encrypted: ', encrypted);
		var decrypted = key.decrypt(encrypted, 'utf8');
		console.log('decrypted: ', decrypted);
		
		//console.log(logConsole(data, 3)); 
		
		if(data == 'MG-CTF 1 state inprog'){
			console.log(logConsole('CTF Minigame, Server 1, is now in progress!', 3));
		}
		eventEmitter.emit('MinigameUpdate');

    });
	
    c.on('end', function ()
    {
        console.log(logConsole('Client disconnected.', 3));
    });
});

var minigameUpdate = function minigameUpdate(){
	console.log(logConsole('minigameUpdate event recived!', 0));
}

eventEmitter.on('MinigameUpdate', minigameUpdate);
console.log(logConsole('This is a test message! woot!', 3));

server.listen(port, function ()
{ 
    console.log(logConsole('IdroServer System ' + versionFull + ' is listening on port ' + port, 3));
});