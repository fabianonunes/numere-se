#!/usr/local/bin/node

var fs		= require('fs')
, path		= require('path')
, express	= require('express')
, winston	= require('winston')
, root		= __dirname;


global._	= require('underscore');
global.app	= express.createServer({
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem')
});
app.logger	= winston;

app.logger.setLevels(winston.config.syslog.levels);
app.logger.add(
	app.logger.transports.File,
	{ filename: 'flashcards.log' }
);

require('./lib/setup.js').setup({
	  app:		app
	, mongoose:	require('mongoose')
	, io:		require('socket.io')
	, express:	express
	, paths:	{
		  models:		path.join(root, 'app', 'models')
		, views:		path.join(root, 'app', 'views')
		, root:			path.join(root, 'ui')
		, images:		path.join(root, 'ui/images')
		, controllers:	path.join(root, 'app', 'controllers')
	}
	// redis:	require('redis-client').createClient(),
});