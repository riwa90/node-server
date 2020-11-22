const session = require('express-session');
const passport = require('passport');
const appID = require('ibmcloud-appid');
const WebAppStrategy = appID.WebAppStrategy;
const CALLBACK_URL = '/ibm/cloud/appid/callback';

function getAppIDConfig () {
	let config;

	try {
		// if running locally we'll have the local config file
		config = require('../config/localdev-config.json');
	} catch (e) {
		if (process.env.APPID_SERVICE_BINDING) {
			// if running on Kubernetes this env variable would be defined
			config = JSON.parse(process.env.APPID_SERVICE_BINDING);
			config.redirectUri = process.env.redirectUri;
		}
		else {
			// running on CF
			let vcapApplication = JSON.parse(process.env['VCAP_APPLICATION']);
			return { redirectUri: 'https://' + vcapApplication['application_uris'][0] + CALLBACK_URL };
		}
	}
	return config;
}

exports.logoutFunction = (req, res) => {
	WebAppStrategy.logout(req);
	res.redirect('/');
};

exports.setupAppLogin = (app) => {
	// Setup express application to use express-session middleware
	// Must be configured with proper session storage for production
	// environments. See https://github.com/expressjs/session for
	// additional documentation
	app.use(
		session({
			secret            : '123456',
			resave            : true,
			saveUninitialized : true,
			proxy             : true
		})
	);

	// Configure express application to use passportjs
	app.use(passport.initialize());
	app.use(passport.session());

	let webAppStrategy = new WebAppStrategy(getAppIDConfig());
	passport.use(webAppStrategy);

	// Configure passportjs with user serialization/deserialization. This is required
	// for authenticated session persistence accross HTTP requests. See passportjs docs
	// for additional information http://passportjs.org/docs
	passport.serializeUser((user, cb) => cb(null, user));
	passport.deserializeUser((obj, cb) => cb(null, obj));

	// Callback to finish the authorization process. Will retrieve access and identity tokens/
	// from AppID service and redirect to either (in below order)
	// 1. the original URL of the request that triggered authentication, as persisted in HTTP session under WebAppStrategy.ORIGINAL_URL key.
	// 2. successRedirect as specified in passport.authenticate(name, {successRedirect: "...."}) invocation
	// 3. application root ("/")
	app.get(CALLBACK_URL, passport.authenticate(WebAppStrategy.STRATEGY_NAME, { failureRedirect: '/error' }));

	// Protect everything under /protected
	app.use('/protected', passport.authenticate(WebAppStrategy.STRATEGY_NAME));

	//Serves the identity token payload
	app.get('/protected/api/idPayload', (req, res) => {
		res.send(req.session[WebAppStrategy.AUTH_CONTEXT].identityTokenPayload);
	});

	app.get('/error', (req, res) => {
		res.send('Authentication Error');
	});
};
