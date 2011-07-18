
var secure	= app.settings.secure
	, User	= app.settings.models.user
	, qs	= require('querystring');

exports.create = function(req, res, next){

	secure.login(req.body.user, req.body.pass).then(function(cookie){

		res.cookie('v', qs.stringify(cookie), {
			expires: new Date(cookie.x)
			, httpOnly: true
			// , secure: true
		});

		res.send({ ok : true });

	}, function(err){
		res.send(403);
	});

}

exports.create_ = function(req, res, next){

	User.findOne({username : req.body.user}, function(err, user){

		if(err) return next(err);
		if(!user) return res.send(403);

		req.user = user;

		secure.login(req, res, next);
		
	});

}

exports.index = _.wrap(function(req, res, next){

	res.send('none' + '\n');

}, secure.authenticate);
