
module.exports.setup = function(o){

	var sys			= require("sys")
		, app		= o.app
		, redis		= o.redis
		, socket	= o.app.socket
		, mongoose	= o.mongoose
		, io		= o.io
		, express	= o.express
		, resource	= require('express-resource')
		, stylus	= require('stylus')
		, nib		= require('nib');

	global.db = mongoose.connect("mongodb://localhost/numerese");

	app.configure(function(){
		app.set('title', 'numere-se')
		app.set('view engine','jade');
		app.set('views', o.paths.views);
		// app.use(express.logger('\033[37m:method\033[0m \033[36m:url\033[0m \033[37m:response-timems\033[0m'));
		app.use(express.cookieParser());
		app.use(express.favicon());
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		// app.use(secure.authenticate);
		app.use(stylus.middleware({
			src: o.paths.root,
			compile: function(str, path) {
				return stylus(str)
				.define('url', stylus.url({
					paths: [o.paths.root.images]
				}))
				.set('compress', true)
				.set('filename', path)
				.include(nib.path);
			}	
		}));
		app.use(express.errorHandler({
			showStack: true,
			dumpExceptions: true
		}));
		app.use(app.router);
		app.use(express.static(o.paths.root));
	});

	var models = require("./models.js").autoload(
		o.paths.models
	);

	var controllers = require("./controllers.js").autoload(
		o.paths.controllers
	);

	app.error(function(err, req, res, next){
		res.send(JSON.stringify({
			message : err
		}, null, '\t').replace(/\\n/g, "\n").replace(/\\/g, '')+'\n');
	});

	app.listen(o.port || 3000);

	app.socket = io.listen(app);

	/*
	// redis pub/sub with socket.io
	redis.subscribeTo("socket-io-broadcast:*",function(channel,message,pattern){
		var payload = JSON.stringify({
			'channel' : channel + '',
			'message' : message + ''
		});
		
		app.socket.broadcast(payload);
	});
	*/
  
};
