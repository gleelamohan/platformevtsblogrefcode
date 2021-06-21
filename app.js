var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var config = require('./config.js');
var jsforce = require('jsforce');
var routes = require('./routes/index');
const { getToken } = require('sf-jwt-token')

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var socket = io.sockets.on('connection', function (socket) { });

var replayId = -1; // -1 = Only New messages | -2 = All Window and New

var channel = '/data/CaseChangeEvent';
/*var user = config.USERNAME;
var pass = config.PASSWORD;
var securityToken = config.SECURITYTOKEN ;*/
const conn = new jsforce.Connection();

 getToken({
  iss: config.CLIENTID,
  sub: config.USERNAME,
  aud: config.URL,
  privateKey: config.KEY
}, function(err, response){

  if (err) {
    console.error(err);
  } else {
    conn.initialize({
      instanceUrl: response.instance_url,
      accessToken: response.access_token
    });
    console.log('Successfully connected to Org');

    var client = conn.streaming.createClient([
      new jsforce.StreamingExtension.Replay(channel, replayId),
      new jsforce.StreamingExtension.AuthFailure(function () {
        console.log('failed');
        return process.exit(1);
      }),
    ]);
  
    subscription = client.subscribe(channel, function (data) {
      console.log('Received CDC Event');
      socket.send(JSON.stringify(data));
      console.log('Data sent to clients!!');
    });
  }

});

/*
 conn.login(user, pass + securityToken, function (err, res) {
	console.log('loggedin');
	if (err) {
		return console.error(err);
	}

	var client = conn.streaming.createClient([
		new jsforce.StreamingExtension.Replay(channel, replayId),
		new jsforce.StreamingExtension.AuthFailure(function () {
			console.log('failed');
			return process.exit(1);
		}),
	]);

	subscription = client.subscribe(channel, function (data) {
		console.log('Received CDC Event');
		socket.send(JSON.stringify(data));
		console.log('Data sent to clients!!');
	});
}); */

// setup view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(function(req, res, next){
  res.io = io;
  next();
});

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

// error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
 
// development error handler - print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler - no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = {app: app, server: server, config: config};
exports.config = config;
exports.socket = socket;
