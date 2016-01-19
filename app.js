// Module dependencies
var express = require('express'),
http = require('http'),
	https = require('https');
path = require('path'),
Cookies = require('cookies');
cheerio = require('cheerio');

const util = require('util');

// Create an express app
var app = express();

// Configure an express app
app.configure(function () {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.cookieParser('secret'));
	app.use(express.session());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
	app.use('/Content', express.static(__dirname + '/Content'));
	app.use('/PageScripts', express.static(__dirname + '/PageScripts'));
	app.use('/Scripts', express.static(__dirname + '/Scripts'));
	app.use('/jasmine', express.static(__dirname + '/jasmine'));
	app.use('/jasmine-node', express.static(__dirname + '/jasmine-node'));
	app.use('/node_modules', express.static(__dirname + '/node_modules'));
	app.use('/Templates', express.static(__dirname + '/Templates'));
});

app.configure('development', function () {
	app.use(express.errorHandler());
});

// Store "session" information.  To see how to store sessions in a cookie, check out
// https://gist.github.com/visionmedia/1491756
var sessionInfo = {
	name : 'Guest'
};

// Create session middleware
var session = function (request, response, next) {
	// TODO: How do we store session data on the request?  How do we continue with the request chain?
	response.cookie('sessionInfo', sessionInfo, {
		maxAge : 900000,
		httpOnly : false
	});
	next();
};

// Handle GET request to root URL
app.get('/', session, function (request, response) {
	response.sendfile('./index.html');
});

// Handle GET request to root URL
app.get('/test', session, function (request, response) {
	response.sendfile('./specRunner.html');
});

app.post('/token', function (request, response) {
	var validResponse = {
		status : 200,
		success : 'Token received'
	};

	var options = {
		hostname : 'cpg-oshift2-master1.cisco.com',
		method : 'GET',
		path: '/oauth/authorize?response_type=token&client_id=openshift-challenging-client',
		port: 8443,
		"headers": {
            "Authorization": "Basic " + new Buffer(request.body.username + ":" + request.body.password, "utf8").toString("base64")
        }
	};
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	var req = https.request(options, (res) => {
	
	res.on('data', (d) => {
		process.stdout.write(d);
		});
		
		if (res.headers.location) {
			validResponse.token = getAccessToken(res.headers.location);
			response.send(validResponse);
		}
		else
		{
			response.status(res.statusCode);
			response.send(res.message);
		}
	req.on('error', (e) => {
		response.send('error');
	});
	
	});
	
	req.end();
});

app.get('/GetAllAutos', function (request, response) {
	
	var responseString = '';
	var rows;
	var returnedObjects = [];
	var newObject = {};

	var invalidResponse = {
		status : 500,
		error : 'Error Retrieving Projects'
	};

	var options = {
		hostname : 'eastnc.craigslist.org',
		method : 'get',
		path: '/search/cta',
		port: 443,
	};
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	var req = https.request(options, (res) => {
		
	 res.on('data', (d) => {
            responseString += d;
        });
		
	 res.on('error', () => {
            response.send(invalidResponse);
        });
		
	 res.on('end', () => {
		$ = cheerio.load(responseString);
		returnedObjects = [];
		$('p[data-pid]').each(function(index, value){
			//get thumbnail//
			newObject = {};
			newObject.name = $(this).find('.hdrlnk').html();
			newObject.price = $(this).find('.price').html();
			newObject.pnr = $(this).find('.pnr').find('small').html();
			newObject.link = $(this).find('a').attr('href');
			//get link details//
		    newObject.details = [];
			console.log('calling function');
			newObject.details.push(getAutoDetails(newObject.link));
		//	newObject.details = 'test';
			returnedObjects.push(newObject);
		//	console.log(getAutoDetails(newObject.link));
		});
		console.log('leaving main function');
        response.send(returnedObjects);
        });
		
	req.on('error', (e) => {
		response.send('error');

	});
	
	

	});
	
	req.end();

	
});



http.createServer(app).listen(app.get('port'), function () {
	console.log("Express server listening on port " + app.get('port') + " - visit http://localhost:3000/");
});

function getAutoDetails(path) {
	
	var responseString = '';
	var rows;
	var returnedObjects = [];
	var detailedObjects = [];
	var workObject = {};
	var newObject = {};

	var invalidResponse = {
		status : 500,
		error : 'Error Retrieving Projects'
	};

	var options = {
		hostname : 'eastnc.craigslist.org',
		method : 'get',
		path: path,
		port: 443,
	};
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
	var req = https.request(options, (res) => {
		
	 res.on('data', (d) => {
            responseString += d;
        });
		
	 res.on('error', () => {
            response.send(invalidResponse);
        });
		
	 res.on('end', () => {
		$d = cheerio.load(responseString);
		detailedObjects = [];
		$d('.mapAndAttrs').each(function(index, value){
			//get thumbnail//
			$d(this).find('span').each(function(index, value)
			{
			workObject = {};
			workObject.attr = $d(this).html()
			detailedObjects.push(workObject);
			});

		});
		console.log('finish details function');
        return detailedObjects;
        });
	
	});
	
	req.on('error', (e) => {
		response.send('error');
	});

	req.end();
	

}
