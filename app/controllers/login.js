
var secure	= app.settings.secure
	, User	= app.settings.models.user
	, qs	= require('querystring');

exports.create = function(req, res, next){

	secure.login(req.body.user, req.body.pass)
	.done(function(cookie){

		res.cookie('v', qs.stringify(cookie, '-', '.'), {
			expires: new Date(cookie.x)
			, _secure: true
			, httpOnly: true
		});

		res.send({ ok : true });

	})
	.fail(res.send.bind(res, null, 403));

}

exports.index = function(req, res, next){

	res.send('fala féla!' + '\n');

}
