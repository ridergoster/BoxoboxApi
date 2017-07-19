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
var arduinoSocket = null;

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

  console.log('someone is connected !', socket.id);

  socket.on('arduino', function(data) {
    arduinoSocket = socket.id;
  });

  socket.on('activate-alarm-luminosity', function () {
    if (arduinoSocket) {
      socket.broadcast.to(arduinoSocket).emit('activate-alarm-luminosity');
    }
  });

  socket.on('activate-alarm-noise', function () {
    if (arduinoSocket) {
      socket.broadcast.to(arduinoSocket).emit('activate-alarm-noise');
    }
  });

  socket.on('desactivate-alarm-luminosity', function () {
    if (arduinoSocket) {
      socket.broadcast.to(arduinoSocket).emit('desactivate-alarm-luminosity');
    }
  });

  socket.on('desactivate-alarm-noise', function () {
    if (arduinoSocket) {
      socket.broadcast.to(arduinoSocket).emit('desactivate-alarm-noise');
    }
  });

  socket.on('alarm-luminosity-activate', function () {
      socket.broadcast.emit('alarm-luminosity-activate');
  });

  socket.on('alarm-noise-activate', function () {
      socket.broadcast.emit('alarm-noise-activate');
  });

  socket.on('alarm-luminosity-desactivate', function () {
      socket.broadcast.emit('alarm-luminosity-desactivate');
  });

  socket.on('alarm-noise-desactivate', function () {
      socket.broadcast.emit('alarm-noise-desactivate');
  });

  socket.on('alarm-noise-trigger', function() {
    socket.broadcast.emit('alarm-noise-trigger');
  });

  socket.on('alarm-luminosity-trigger', function() {
    socket.broadcast.emit('alarm-luminosity-trigger');
  });

  socket.on('alarm-stop', function(data) {
    socket.broadcast.emit('alarm-stop', data);
  })

  socket.on('disconnect', function() {
    if (socket.id === arduinoSocket) {
      console.log('ARDUINO DISCONNECT !');
      arduinoSocket = null;
    } else {
      console.log('user disconnect', socket.id);
    }
 });
});

module.exports = server;
