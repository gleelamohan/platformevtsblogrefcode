exports.PORT = process.env.PORT || 3001; // use heroku's dynamic port or 3001 if localhost
exports.DEBUG = true;
exports.ENVIRONMENT = 'production';

exports.CALLBACK_URL = process.env.CALLBACKURL ;
exports.TOPIC = '/event/' + process.env.EVENTCHANNEL ;
exports.REPLAY_ID = -1;

exports.CLIENT_ID = process.env.CLIENTID;
exports.CLIENT_SECRET = process.env.CLIENTSECRET;
exports.USERNAME = process.env.USERNAME;
exports.PASSWORD = process.env.PASSWORD;


