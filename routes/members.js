var express = require('express');
var router = express.Router();
var storage = require('node-persist');
var _ = require('lodash');
var members = storage.getItem('members') || [];
var utils = require('../helpers/utils');

var initMembers = function () {
  members.push({
    id: "1",
    name: "Jason"
  });
  storage.setItem('members', members);
};

router.get('/', function(req, res, next) {
  res.type('application/json');
  if (_.isEmpty(members)) {
    initMembers(); 
  }
  res.send(members);
});

router.get('/:id', function(req, res, next) {
  res.type('application/json');
  var id = req.params.id;
  if (!id) {
    return utils.notValidErrorResponse(res);
  }
  if (_.isEmpty(members)) {
    initMembers();
  }
  var member = utils.getEntityFromCollection(id, members);
  if (!member) {
    return utils.notFoundErrorResponse(res);
  }
  res.send(member);
});

module.exports = router;
