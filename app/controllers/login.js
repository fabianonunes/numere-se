
var secure = app.settings.secure;
var users = app.settings.models.user;

exports.create = function(req, res, next){

	users.findOne({username : req.body.user}, function(err, user){

		if(err || !user) return next(err);

		req.user = user;

		secure.login(req, res, next);
		
	});

}

exports._index = _.wrap(function(req, res, next){

	res.send('none' + '\n');

}, secure.authenticate);
