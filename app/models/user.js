
var mongoose = require("mongoose");

var User = new mongoose.Schema({
	username : {
		type : String,
		required : true,
		index : { unique : true }
	}
	, salt : { type : String, required: true }
	, email : String
	, auth : { type : String, required : true }
});

User.virtual('id').get(function() {
	return this._id.toHexString();
})

module.exports = mongoose.model('User', User);

