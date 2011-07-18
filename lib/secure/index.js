
var  crypto		= require('crypto')
	, hashlib	= require('hashlib')
	, deferred	= require('deferred')
	, _			= require('underscore')
	, qs		= require('querystring')
	, t			= require('tictoc');

var secure = {

	K : '1375ed62eba9bee2e7e71099347fc39c3e210e35e1c5c8a3d616fd9657f9e315',
	
	H : hashlib.sha256,

	login : function(username, password){

		var d = deferred();
		var self = this;

		this.findUser(username).then(function(user){
			var r = self.createSession(user, password);
			d.resolve(r);
		}, function(err){
			d.resolve(err);
		});

		return d.promise;

	},

	createSession : function(user, password){

		var c_auth = this.aN(user.salt, password);

		if(user.auth == this.H(c_auth)) {

			var cookie = {
				c: c_auth,
				u: user.username,
				x: Date.now()*1 + 2*36e5
			};

			var key = this.hmac(cookie.u + cookie.x, this.K);

			cookie.s = this.hmac(this.stringify(cookie), key);

			return cookie;

		} else {
			
			return new Error('invalid password');

		}

	},

	findUser : function(username){

		var User = app.settings.models.user;

		var d = deferred();

		User.findOne({username : username}, function(err, user){

			if(err) return d.resolve(err);

			var x = new Error('user not exixts');

			user ? d.resolve(user) : d.resolve(x);
			
		});

		return d.promise;

	},

	hmac: function(message, k){
		var hmac = crypto.createHmac('sha256', k);
		hmac.update(message);
		return hmac.digest('hex');
	},

	authenticate: function(verb, req, res, next){

		var User = app.settings.models.user;
		var self = this;

		// if(req.route.path.split('.')[0]=="/login"){
		// 	return verb(req, res, next);
		// }

		// TODO: criar uma função que além de parsear,
		// tb valida oo parametros do cookie
		var cookie = qs.parse(req.cookies.v, '-', '.');

		if(cookie.x > Date.now()){

			var key = this.hmac([cookie.u, cookie.x].join(''), this.K);

			var signature = cookie.s;
			var message = this.stringify(cookie);
			delete cookie.s;

			if(this.hmac(message, key) === signature){

				User.findOne({username : cookie.u}, function(err, user){

					if(err) return next(err);
					if(!user) return res.send(403);

					self.H(cookie.c) === user.auth ? verb(req, res, next) : res.send(403);
					
				});

			} else {
				res.send(403);	
			}

		} else {
			res.send(403);
		}

	},

	aN : function(salt, pass){
		for(i=0;i<1024;i++){ salt = this.H(salt+pass); }
		return salt;
	},

	stringify : function(cookie){
		delete cookie.s;
		return Object.keys(cookie).sort().map(function(k){
			return k+"."+cookie[k];
		}).join('-');
	}

}

_.bindAll(secure);

module.exports = secure;