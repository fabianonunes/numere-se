
var sys = require("sys")
	, mongoose = require("mongoose");

var User = new mongoose.Schema({
	username	: {type: String, required: true}
	, salt		: {type: String, required: true}
	, email		: String
	, auth		: {type: String, required: true}
});

User.virtual('id').get(function() {
	return this._id.toHexString();
})

User.index({
	username : 1
}, {unique : true});

module.exports = mongoose.model('User', User);

