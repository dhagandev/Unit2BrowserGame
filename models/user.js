var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	name: String,
	email: String,
	googleId: String,
	img: {
		type: String
	},
	money: {
		type: Number,
		default: 50000
	},
	dogs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Dog'}]
}, {
	timestamps: true
});

module.exports = mongoose.model('User', userSchema)