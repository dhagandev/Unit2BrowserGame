var mongoose = require('mongoose');

var dogSchema = new mongoose.Schema({
	name: String,
	img: {
		data: Buffer,
		contentType: String
	},
	gender: String,
	hunger: {
		type: Number,
		default: 75
	},
	thirst: {
		type: Number,
		default: 75
	},
	happiness: {
		type: Number,
		default: 75
	},
	studding: {
		type: Boolean,
		default: false
	},
	mom: {
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Dog'
	},
	dad: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Dog'
	},
	children: [{type: mongoose.Schema.Types.ObjectId, ref: 'Dog'}],
	mainBreed: String,
	breedPercent: [{breed: String, percentage: Number}],
	genetics: {
		brain: [String], 
		heart: [String],
		lungs: [String],
		joints: [String],
		coat: [String]
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
}, {
	timestamps: true
});

module.exports = mongoose.model('Dog', dogSchema)