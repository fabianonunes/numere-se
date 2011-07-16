

var rbytes = require('rbytes')
	, _ = require('underscore')
	, crypto = require('crypto')
	, qs = require('querystring')
	, hashlib = require('hashlib')
	, mongoose = require("mongoose");

var Auth = {

	K : '1375ed62eba9bee2e7e71099347fc39c3e210e35e1c5c8a3d616fd9657f9e315',
	H : hashlib.sha256,

	login: function(req, res, next){

		if(req.user.auth == (c_auth = this.aN(req.user.salt, req.body.pass))) {

			var cookie = {
				x: Date.now()*1 + 2*36e5,
				u: req.user.username,
				c: c_auth
			};
			
			var MAC = crypto.createHmac('sha256', this.K);
			MAC.update(this.stringifyCookie(cookie));
			cookie.s = MAC.digest('hex');

			res.cookie('v', this.stringifyCookie(cookie), {
				expires: new Date(cookie.x)
				, httpOnly: true
				// , secure: true
			});

			res.send({ok:true});

		} else {

			next(new Error('login denied'));

		}

	},

	authenticate: function(verb, req, res, next){

		var cookie = qs.parse(req.cookies.v, '-', '.');
		var MAC = crypto.createHmac('sha256', this.K);
		var sign = cookie.s;
		delete cookie.s;

		cookie = this.stringifyCookie(cookie);
		MAC.update(cookie);

		if(MAC.digest('hex') == sign){
			req.auth = true;
			verb(req, res, next);
		} else {
			next(new Error('access denied'.bold.red.inverse));
		}


	},

	findUser : function(user, next){

		var User = mongoose.model('User');

		User.find({username:user}, [], {
			limit : 1
		}, next);
	
	},

	aN : function(salt, pass){
		for(i=0;i<1024;i++){ salt = this.H(salt+pass); }
		return salt;
	},

	stringifyCookie : function(cookie){
		return _.map(_.keys(cookie).sort(), function(k){
			return k+"."+cookie[k];
		}).join('-');
	}

}

_.bindAll(Auth);

exports.create = function(req, res, next){

	Auth.findUser(req.body.user, function(err, user){

		if(err || !user[0]) return next(err);

		req.user = user[0];

		Auth.login(req, res, next);
		
	});

}

exports.index = _.wrap(function(req, res, next){

	res.send(req.auth + '\n');

}, Auth.authenticate);



