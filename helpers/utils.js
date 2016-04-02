'use strict';

module.exports = {

  createEntityId: function(collection) {
    if (collection.length === 0) {
      return 1;
    }
    var id = 0;
    collection.map(function (entity) {
      if (entity.id > id) {
        id = parseInt(entity.id);
      }
    });
    id += 1;
    return id.toString();
  },

  parserErrors: function(error) {
    var jsonArray = [];
    for (var i = 0; i < error['errors'].length; i++) {
      jsonArray.push({
        'message': error['errors'][i]['message']
      });
    }
    return {
      'errors': true,
      'messages': jsonArray
    };
  },

  parserDataBaseErrors: function(error) {
    return {
      'errors': true,
      'messages': [{
        'message': error['message']
      }]
    };
  },

  createdResponse: function (response) {
    response.status(201);
    response.send({
            'errors': false,
            'messages': [{
              'message': 'Created'
            }]
          });
    return response;
  },

  updatedResponse: function (response) {
    response.status(200);
    response.send({
            'errors': false,
            'messages': [{
              'message': 'Updated'
            }]
          });
    return response;
  },

  deletedResponse: function (response) {
    response.status(200);
    response.send({
            'errors': false,
            'messages': [{
              'message': 'Deleted'
            }]
          });
    return response;
  },

  notFoundErrorResponse: function (response) {
    response.status(404);
    response.send({
            'errors': true,
            'messages': [{
              'message': 'Not Found'
            }]
          });
    return response;
  },

  notValidErrorResponse: function (response) {
    response.status(422);
    response.send({
            'errors': true,
            'messages': [{
              'message': 'Missings Params'
            }]
          });
    return response;
  },

  getEntityFromCollection: function(id, collection) {
    var result = false;
    collection.map(function (item) {
      if (item.hasOwnProperty('id')) {
        if (item.id == id) {
          result = item;
        }
      }
    });
    return result;
  },

  getEntityPositionFromCollection: function (id, collection) {
    var position = 0;
    collection.map(function (item, index) {
      if (item.hasOwnProperty('id')) {
        if (item.id == id) {
          position = index;
        }
      }
    });
    return position;
  },
};