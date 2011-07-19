
var  crypto		= require('crypto')
	, hashlib	= require('hashlib')
	, deferred	= require('deferred')
	, _			= require('underscore')
	, qs		= require('querystring');

var secure = {

	K : '1375ed62eba9bee2e7e71099347fc39c3e210e35e1c5c8a3d616fd9657f9e315',
	H : hashlib.sha256,

	login : function(username, password){

		var d	= deferred()
		, self	= this;

		this.findUser(username).then(function(user){
			d.resolve(self.createSession(user, password));
		}, d.resolve.bind(d));

		return d.promise;

	},

	createSession : function(user, password){

		var c_auth = this.aN(user.salt, password);

		if(user.auth === this.H(c_auth)) {

			var cookie = {
				c: c_auth,
				u: user.username,
				x: Date.now()*1 + 2*36e5
			};

			var key = this.hmac(cookie.u + cookie.x, this.K);

			cookie.s = this.hmac(this.stringify(cookie), key);

			return cookie;

		} else return new Error('invalid password');

	},

	findUser : function(username){

		var d	= deferred()
		, User	= app.settings.models.user;

		User.findOne({username : username}, function(err, user){

			if(err) return d.resolve(err);

			user ? d.resolve(user) : d.resolve(new Error('user not exixts'));
			
		});

		return d.promise;

	},

	hmac: function(message, k){
		var hmac = crypto.createHmac('sha256', k);
		hmac.update(message);
		return hmac.digest('hex');
	},

	authenticate : function(cookie){

		var d		= deferred()
		, User		= app.settings.models.user
		, self		= this;

		if(cookie.x > Date.now()){

			var key			= this.hmac([cookie.u, cookie.x].join(''), this.K)
			, signature		= cookie.s
			, message		= this.stringify(cookie);

			if(this.hmac(message, key) === signature){

				this.findUser(cookie.u).then(function(user){

					if(self.H(cookie.c) === user.auth){
						d.resolve(user);
					} else {
						d.resolve(new Error('cookie invalid'));
					}

				}, d.resolve.bind(d));

			} else d.resolve(new Error('cookie corruted'));

		} else d.resolve(new Error('cookie expired'));

		return d.promise;

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
	},

	middleware : function(req, res, next){

		if(~["/login", "/user"].indexOf(req.url) && req.method == "POST"){
			return next();
		}

		// TODO: criar uma função que além de parsear,
		// tb valida oo parametros do cookie
		var cookie = qs.parse(req.cookies.v, '-', '.');

		this.authenticate(cookie).then(function(){
			next();
		}, res.send.bind(res, null, 403));

	}

}

_.bindAll(secure);

module.exports = secure;