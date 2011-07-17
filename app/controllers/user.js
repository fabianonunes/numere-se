
var hashlib		= require('hashlib')
	, rbytes	= require('rbytes')
	, mongoose	= require('mongoose')
	, secure	= app.settings.secure;

var User = mongoose.model('User');

exports.create = function(req, res, next){

	var salt = rbytes.randomBytes(32).toHex();

	var user = new User({
		username : req.body.user
		, salt : salt
		, auth : secure.H(secure.aN(salt, req.body.pass))
	});

	user.save(function(err, user){
		if(err) return next(err);
		console.log(user);
		res.send({
			user: user.username
		});
	});

}

