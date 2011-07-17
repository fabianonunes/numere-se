
var  crypto		= require('crypto')
	, hashlib	= require('hashlib')
	, _			= require('underscore')
	, qs		= require('querystring')
	, t			= require('tictoc');



var secure = {

	K : '1375ed62eba9bee2e7e71099347fc39c3e210e35e1c5c8a3d616fd9657f9e315',
	
	H : hashlib.sha256,

	login: function(req, res, next){



		var c_auth = this.aN(req.user.salt, req.body.pass);

		if(req.user.auth == this.H(c_auth)) {

			var cookie = {
				c: c_auth,
				u: req.user.username,
				x: Date.now()*1 + 2*36e5
			};

			var key = this.hmac(cookie.u+cookie.x, this.K);

			cookie.s = this.hmac(this.stringify(cookie), key);

			res.cookie('v', this.stringify(cookie), {
				expires: new Date(cookie.x)
				, httpOnly: true
				// , secure: true
			});

			res.send({ ok : true });

		} else {

			res.send(403);

		}

	},

	hmac: function(message, k){
		var hmac = crypto.createHmac('sha256', k);
		hmac.update(message);
		return hmac.digest('hex');
	},

	authenticate: function(verb, req, res, next){

		var User = app.settings.models.user
			, self = this;

		// if(req.route.path.split('.')[0]=="/login"){
		// 	return verb(req, res, next);
		// }

		var cookie = qs.parse(req.cookies.v, '-', '.');

		if(cookie.x > Date.now()){

			var key = this.hmac([cookie.u, cookie.x].join(''), this.K);

			var signature = cookie.s;
			delete cookie.s;
			var message = this.stringify(cookie);

			if(this.hmac(message, key) === signature){

				User.findOne({username : cookie.u}, function(err, user){

					if(err) return next(err);
					if(!user) return res.send(403);

					if(self.H(cookie.c) === user.auth){

						req.auth = true;
						verb(req, res, next);
						
					} else {
						res.send(403);
					}
					
				});
				
			} else {
				res.send(403);	
			}

		} else {
			res.send(403);
		}

	},

	compare : function(pass, hash){},

	aN : function(salt, pass){
		for(i=0;i<1024;i++){ salt = this.H(salt+pass); }
		return salt;
	},

	stringify : function(cookie){
		return Object.keys(cookie).sort().map(function(k){
			return k+"."+cookie[k];
		}).join('-');
	}

}

_.bindAll(secure);

module.exports = secure;