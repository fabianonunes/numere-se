
var rbytes = require('rbytes')
	, _ = require('underscore')
	, crypto = require('crypto')
	, hashlib = require('hashlib')
	, mongoose = require("mongoose")
	, querystring = require('querystring');

// var User = mongoose.model('User');


var Auth = {

	K : '1375ed62eba9bee2e7e71099347fc39c3e210e35e1c5c8a3d616fd9657f9e315',
	H : hashlib.sha256,

	createAccount: function(user, pass, next){

		var salt		= rbytes.randomBytes(32).toHex()
			, v_auth	= this.aN(salt, pass)
			, store		= redback.createHash(user);

		store.set({
			salt : salt,
			auth : v_auth, 
			name : user
		}, next);

	},

	login: function(user, pass){

		var store = redback.createHash(user);

		if(user && user.v_auth == (c_auth = this.aN(user.salt, pass))) {

			var cookie = {
				exp: Date.now()*1 + 2*36e5,
				data: user.name,
				c_auth: c_auth
			};
			
			var MAC = this.hmac();

			MAC.update(this.stringifyCookie(cookie));
			cookie.sign = MAC.digest('hex');

			return this.stringifyCookie(cookie);

		} else {

			return false;

		}
		
	},

	authenticate: function(cookie){
		
		var MAC = this.hmac();
		var sign = cookie.sign;
		delete cookie.sign;

		cookie = this.stringifyCookie(cookie);
		MAC.update(cookie);

		var calc_sign = MAC.digest('hex');

		if(calc_sign == sign){
			console.log('access granted'.green.inverse);
		} else {
			console.log('access denied'.bold.red.inverse, calc_sign);
		}


	},

	aN : function(salt, pass){
		for(i=0;i<1024;i++){ salt = this.H(salt+pass); }
		return salt;
	},

	stringifyCookie : function(cookie){
		return _.map(_.keys(cookie).sort(), function(k){
			return k+"="+cookie[k];
		}).join('&');
	},

	hmac : function(){
		return crypto.createHmac('sha256', this.K);
	}

}


// var https = require('https');
// var fs = require('fs');
// var options = {
// 	key: fs.readFileSync('privatekey.pem'),
// 	cert: fs.readFileSync('certificate.pem')
// };
// https.createServer(options, function (req, res) {
// 	console.log(req);
// 	res.writeHead(200);
// 	res.end("hello world\n");
// }).listen(443);




exports.authenticate = function (req, res, next) {
	false
	? next()
	: next(new Error('Unauthorized'));
};

module.exports = Auth;
