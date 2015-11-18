var _ = require('underscore');
var models = require('../models');

var Item = models.Item;

var makerPage = function(req, res) {
	res.render('app');
};

var makeItem = function(req, res) {
    
    var itemData = {
        owner: req.session.account._id
    };
    
    var newItem = new Item.ItemModel(itemData);
    
    newItem.save(function(err) {
        if(err) {
            console.log(err);
            return res.status(400).json({error:'An error occurred'}); 
        }

        res.json({redirect: '/maker'});
    });
    
};

module.exports.makerPage = makerPage;
module.exports.make = makeItem;