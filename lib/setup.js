
module.exports.setup = function(o){

	global.db = o.mongoose.connect(o.mongourl+"/numerese");

	var models	= require("./models").autoload(o.paths.models)
	, secure	= require('secure')(o.serverKey, models.user)
	, app		= o.app
	, express	= o.express
	, resource	= require('express-resource')
	, stylus	= require('stylus');

	app.configure(function(){
		app.set('models', models);
		app.set('secure', secure);
		app.set('title', 'numere-se');
		app.set('view engine','jade');
		app.set('views', o.paths.views);
		app.use(express.logger(':method :url :response-time ms'));
		app.use(express.cookieParser());
		app.use(express.favicon());
		app.use(express.bodyParser());
		app.use(express.methodOverride());
		app.use(stylus.middleware({
			src: o.paths.root,
			compile: function(str, path) {
				return stylus(str)
				.define('url', stylus.url({
					paths: [o.paths.root.images]
				}))
				.set('compress', true)
				.set('filename', path)
				.include(require('nib').path);
			}	
		}));
		app.use(express.errorHandler({
			showStack: true,
			dumpExceptions: true
		}));
		app.use(secure.middleware.bind(secure));
		app.use(app.router);
		app.use(express.static(o.paths.root));
	});

	var controllers = require("./controllers.js").autoload(
		o.paths.controllers
	);

	app.error(function(err, req, res, next){
		console.log('error');
		res.send(JSON.stringify({
			message : err.stack
		}, null, '\t').replace(/\\n/g, "\n").replace(/\\/g, '')+'\n');
	});

	app.listen(o.port || 8080);
	
	/*
	, redis		= o.redis
	, socket	= o.app.socket
	, io		= o.io
	app.socket = io.listen(app);
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
