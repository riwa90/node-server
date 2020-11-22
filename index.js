// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
var app = require('./app');

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// Starta server
app.listen(appEnv.port, '0.0.0.0', function() {
    console.log("server starting on " + appEnv.url + " port " + appEnv.port);
}); 