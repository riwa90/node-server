var express = require('express');
var bodyParser = require('body-parser');
let antisql = require('./middleware/anti-sql');
let loginUtil = require('./util/appLoginSetup');
let visitorMsgRouter = require('./Routers/RouteVisitorMsg');
let displayMsgRouter = require('./Routers/RouteDisplayMsg');
let publicrouter = require('./Routers/RoutePublic');

// create a new express server
var app = express();

// Configure authentication functionality, also sets up authentication endpoints
loginUtil.setupAppLogin(app);

// Middleware
app.use(bodyParser.json());
app.use(antisql);
// Serve login screen
app.use(express.static(__dirname + '/public'));

// Serve web-app from protected folder
app.use('/protected', express.static('protected'));

//Routes
app.use('/protected/api/displaymsg', displayMsgRouter);
app.use('/protected/api/visitormsg', visitorMsgRouter);
app.use('/', publicrouter);

module.exports = app;
