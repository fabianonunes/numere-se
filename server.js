#!/usr/local/bin/node

var fs		= require('fs')
, path		= require('path')
, express	= require('express')
, winston	= require('winston')
, root		= __dirname;

global._	= require('underscore');
global.app	= express.createServer();

app.logger	= winston;

app.logger.setLevels(winston.config.syslog.levels);
app.logger.add(
	app.logger.transports.File,
	{ filename: 'numerese.log' }
);

var envfilepath = process.env.HOME + '/environment.json'
environment = JSON.parse(fs.readFileSync(envfilepath));

require('./lib/setup.js').setup({
	  app:			app
	, environment:	environment
	, mongourl:		environment.DOTCLOUD_DATA_MONGODB_URL
	, mongoose:		require('mongoose')
	, io:			require('socket.io')
	, express:		express
	, paths:		{
		  models:		path.join(root, 'app', 'models')
		, views:		path.join(root, 'app', 'views')
		, root:			path.join(root, 'ui')
		, images:		path.join(root, 'ui/images')
		, controllers:	path.join(root, 'app', 'controllers')
	}
	// redis:	require('redis-client').createClient(),
});