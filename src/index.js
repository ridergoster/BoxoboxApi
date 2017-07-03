// Init variable
var app = require('./server');
var api = require('./api');
var mongoose = require('mongoose');
var settings = require('./api/settings');
var _ = require('lodash');
var env = process.env.NODE_ENV;
// Init Socket.io
var server = require('http').Server(app);
var io = require('socket.io')(server);

// Init mongodb connexion
if(env === 'production') {
  mongoose.connect(settings.db.url.prod);
}
else {
  mongoose.connect(settings.db.url.dev);
}

mongoose.Promise = require('bluebird');

// Home request API
app.get('/', function (req, res) {
  res.send('Welcome to Boxobox-API ! <br/><br/>-Go to /api to Show all route of the API<br/><br/>-Go to /swagger to see the API documentation');
});

// user API router
app.use('/api', api);

// Server listener
var port = process.env.PORT || settings.server.port;


// Server listening
server.listen(port, function () {
  console.log('API listening at port %s', port);
});

io.on('connection', function (socket) {
  var addedUser = false;
  var rooms = [];

  socket.on('add user', function (data) {
    if (addedUser) return;
    socket.username = data.username;
    addedUser = true;
  });

  socket.on('join room', function (data) {
    if (rooms.indexOf(data.roomId) > -1) return;
    rooms.push(data.roomId);
    socket.join(data.roomId);
    io.in(data.roomId).emit('user joined', {
      username: socket.username
    });
  });

  socket.on('leave room', function (data) {
    if (rooms.indexOf(data.roomId) < 0) return;
    socket.leave(data.roomId);
    rooms = _.pull(rooms, data.roomId);
    io.in(data.roomId).emit('user left', {
      username: socket.username
    });
  });

  socket.on('send message', function (data) {
    io.in(data.roomId).emit('message received', {
      roomId: data.roomId,
      message: data.message,
      username: data.username
    });
  });

  socket.on('disconnect', function() {
    console.log('Got disconnect!');
    socket.username = null;
    _.forEach(rooms, function(room) {
      socket.leave(room);
    });
    rooms = [];
    addedUser = false;
 });
});

module.exports = server;
