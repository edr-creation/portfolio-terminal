var express = require('express');
var path = require('path');
var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('./'));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

io.on('connection', function(socket) {
    socket.on('command enter', function(command) {
        if (command === 'clear') {
            socket.emit('clear');
        } else if (command === 'help') {
            socket.emit('help');
        } else if (command === 'enzo') {
            socket.emit('enzo');
        } else {
            socket.emit('unknown');
        }
    });
});

http.listen(5050, function() {
    console.log('Listening on port 5050...');
});
