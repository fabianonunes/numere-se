
require('colors');
var hashlib		= require('hashlib')
	, rbytes	= require('rbytes')
	, redback = require('redback').createClient();


var rbuff = rbytes.randomBytes(16);
var H = hashlib.sha256

var Auth = {
	signup : function(user, password, next){

		var Store = redback.createHash(user);

		// Store.get('v', console.log);

		var salt = rbuff.toHex();
		var v_auth = this.aN(salt, password);

		// Store.set({v:v_auth, salt:salt}, next);

	},
	login : function(user, password){


		
	},
	aN: function(salt, password){
		var hash = '';
		for(var i = 0;i<512;i++){
			hash = H(hash+salt+password);
		}
		return hash;
	}
}

Auth.signup('falha404', 'senha123');

exports.authenticate = function (req, res, next) {
	false
	? next()
	: next(new Error('Unauthorized'));
};
