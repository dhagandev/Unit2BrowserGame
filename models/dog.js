var mongoose = require('mongoose');

var dogSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	img: String,
	gender: {
		type: String,
		required: true
	},
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
		ref: 'Dog',
		default: null
	},
	dad: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Dog',
		default: null
	},
	children: [{type: mongoose.Schema.Types.ObjectId, ref: 'Dog'}],
	mainBreed: {
		type: String,
		required: true
	},
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