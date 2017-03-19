'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var multer = require('multer');

// var cookieParser = require('cookie-parser');
// var session = require('express-session');

var app = module.exports = loopback();


/**
 * Create storage folder
**/
var dir = path.join(__dirname + '/storage');
if (!fs.existsSync(dir)){
	fs.mkdirSync(dir);
}

/**
 * Create log folder
**/
// dir = path.join(__dirname + '/log');
// if (!fs.existsSync(dir)){
// 	fs.mkdirSync(dir);
// }



/**
 *  loopback inject bootOptions
**/
// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
var bootOptions = { "appRootDir": __dirname, "bootScripts" : [
											"./boot/test-model.js",
											"./boot/admin-model.js",
											"./boot/category-model.js"] };

boot(app, bootOptions, function(err) {
	if (err) throw err;

	// start the server if `$ node server.js`
	if (require.main === module) {
			app.start();
	}
});

// The access token is only available after boot
app.use(loopback.token({
	model: app.models.accessToken
}));

//toekn refresh
app.use(function(req, res, next) {

    var token = req.accessToken;
    if (!token) {
        return next();
    };
    var now = new Date();
    if ( now.getTime() - token.created.getTime() < 1000 ) {
        return next();
    };    
    req.accessToken.created = now;
    req.accessToken.ttl     = 60 * 60 * 24; // 1day 604800 one week
    req.accessToken.save(next);
});

// configure body parser
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.use(multer()); // for parsing multipart/form-data


/**
 *  GET environment
 * 	URL redirect
**/
var environment = process.env.NODE_ENV; 

if (environment === 'staging' || environment === 'production')   //배포 환경
{ 
	// Just send the index.html for other files to support HTML5Mode		
	app.use(loopback.static(path.resolve(__dirname, '../dist')));
	app.all('/admin/*', function(req, res, next) {
		res.sendFile('admin/index.html', { root: path.resolve(__dirname, '..', 'dist') });
	});	

	// Just send the index.html for other files to support HTML5Mode
	app.use(loopback.static(path.resolve(__dirname, '../dist/web')));
	app.all('/*', function(req, res, next) {
		if(req.originalUrl.includes('/api/')) next();
		else res.sendFile('index.html', { root: path.resolve(__dirname, '..', 'dist/web') });
	});
} 
else  //테스트 환경
{ 
	// Just send the index.html for other files to support HTML5Mode		
	app.use(loopback.static(path.resolve(__dirname, '../client')));
	app.all('/admin/*', function(req, res, next) {
		res.sendFile('admin/index.html', { root: path.resolve(__dirname, '..', 'client') });
	});	

	// Just send the index.html for other files to support HTML5Mode
	app.use(loopback.static(path.resolve(__dirname, '../client/web')));
	app.all('/*', function(req, res, next) {
		if(req.originalUrl.includes('/api/')) next();
		else res.sendFile('index.html', { root: path.resolve(__dirname, '..', 'client/web') });
	});
}


/**
 *  loopback start
**/
app.start = function() {
	// start the web server
	return app.listen(function() {
		app.emit('started');
		var baseUrl = app.get('url').replace(/\/$/, '');
		console.log('Web server listening at: %s', baseUrl);
		if (app.get('loopback-component-explorer')) {
			var explorerPath = app.get('loopback-component-explorer').mountPath;
			console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
		}
	});
};