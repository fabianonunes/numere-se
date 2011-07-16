
var _ = require('underscore')
	, crypto = require('crypto')
	, qs = require('querystring')
	, hashlib = require('hashlib')
	, express = require('express')
	, _t = require('tictoc');

var secure = {

	K : '1375ed62eba9bee2e7e71099347fc39c3e210e35e1c5c8a3d616fd9657f9e315',
	H : hashlib.sha256,

	login: function(req, res, next){

		_t.tic();
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
		_t.toc();

	},

	authenticate: function(verb, req, res, next){

		if(req.route.path.split('.')[0]=="/login"){
			return verb(req, res, next);
		}

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
			res.send(403);
		}


	},

	aN : function(salt, pass){
		for(i=0;i<1024;i++){ salt = this.H(salt+pass); }
		return salt;
	},

	stringifyCookie : function(cookie){
		return Object.keys(cookie).sort().map(function(k){
			return k+"."+cookie[k];
		}).join('-');
	}

}

_.bindAll(secure);

module.exports = secure;