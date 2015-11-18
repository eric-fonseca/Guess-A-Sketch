var mongoose = require('mongoose');
var _ = require('underscore');

var ItemModel;

var ItemSchema = new mongoose.Schema({
    
    owner: 	{
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'Account'
	}

});

ItemModel = mongoose.model('Item', ItemSchema);


module.exports.ItemModel = ItemModel;
module.exports.ItemSchema = ItemSchema;