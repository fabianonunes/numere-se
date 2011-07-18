
var secure = app.settings.secure
	, User = app.settings.models.user;

exports.create = function(req, res, next){

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
