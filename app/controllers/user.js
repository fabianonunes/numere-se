
var rbytes = require('rbytes')
	, hashlib = require('hashlib')
	, mongoose = require("mongoose");

var Auth = {

	H : hashlib.sha256,

	aN : function(salt, pass){
		for(i=0;i<1024;i++){ salt = this.H(salt+pass); }
		return salt;
	}

}

exports.create = function(req, res, next){

	var User = mongoose.model('User');

	var user = new User();
	user.username = req.body.user;
	user.salt = rbytes.randomBytes(32).toHex();
	user.auth = Auth.aN(user.salt, req.body.pass);
	
	user.save(function(err, user){
		if(err) return next(err);
		res.send({
			user: user.username
		});
	});

}

