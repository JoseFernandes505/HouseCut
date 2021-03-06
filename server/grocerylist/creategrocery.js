// Implemented by Kaleb
var task = require('../models/task.js');
var jwtDecode = require('jwt-decode');
var Household = require('../models/household.js');
var grocery = require('../models/grocery.js');
var utilities = require('../utilities.js');

module.exports = function(req,res) {
  var token = req.body.token;
  var decoded = jwtDecode(token);
  var currentUserId = decoded.id;

  var itemName = req.body.itemName;

  if (!itemName || itemName === "") {
    res.json({
      success: false,
      message: "No name provided."
    });
  }
  else {
    utilities.getHouseholdFromUserId(currentUserId, function(hh) {
      if (!hh) {
        res.json({
          success: false,
          message: "User is not a member of a household."
        });
      }

      var sameNameIndex = hh.groceryList.find(function(e) {
        return (e.name === itemName);
      });

      if (sameNameIndex !== undefined) {
        res.json({
          success: false,
          message: 'Grocery item already exists.'
        });
        return;
      }

      var groceryItem = new grocery({
        name: itemName
      });

      Household.update( { '_id' : hh._id}, { $push: {'groceryList': groceryItem} }, function(err) {
        if (err) {
          throw err;
        }
        res.json ({
          success: true,
          message: "Item added."
        });
      });

    });
  }

};
