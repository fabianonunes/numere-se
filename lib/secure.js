
require('colors');
var hashlib		= require('hashlib')
	, rbytes	= require('rbytes')
	, redback = require('redback').createClient();


var rbuff = rbytes.randomBytes(16);
var H = hashlib.sha256
var Store = {};

var Auth = {
	signup : function(user, password){

		var salt = rbuff.toHex();
		var v_auth = this.aN(salt, password);

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

exports.authenticate = function (req, res, next) {
	false
	? next()
	: next(new Error('Unauthorized'));
};
