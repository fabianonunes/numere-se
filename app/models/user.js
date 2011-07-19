
var mongoose	= require('mongoose')
, jdefer		= require('../../lib/jdefer/jdefer');

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
});

User.statics.findByUsername = function(username){

	var d	= jdefer();

	this.findOne({username : username}, function(err, user){

		user ? d.resolve(user) : d.reject(err || new Error('user not exixts'));
		
	});

	return d.promise();

};

module.exports = mongoose.model('User', User);

