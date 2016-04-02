var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.type('application/json');
  var endpoints = {
    endpoints: [{
      team: [{
        method: "get",
        path: "/",
        description: "retreives all the team members"
      }, {
        method: "get",
        path: "/:id",
        description: "retreives a single member of the team"
      }],
      students: [{
        method: "get",
        path: "/",
        description: "retreives all the students"
      }, {
        method: "post",
        path: "/",
        description: "creates a new student"
      }, {
        method: "put",
        path: "/:id",
        description: "updates all attribues for a single student"
      }, {
        method: "patch",
        path: "/:id",
        description: "updates some attributes for a single student"
      }, {
        method: "detele",
        path: "/:id",
        description: "deletes a single student"
      }],
      notes: [{
        method: "get",
        path: "/",
        description: "retreives all the notes"
      }, {
        method: "get",
        path: "/:student_id",
        description: "retreives all notes for a single student"
      }, {
        method: "post",
        path: "/:student_id",
        description: "creates a new note for a single student"
      }, {
        method: "put",
        path: "/:student_id",
        description: "updates the grade for a single student"
      }, {
        method: "patch",
        path: "/:student_id",
        description: "updates the grade for a single student"
      }]
    }]
  };

  res.send(endpoints);
});

module.exports = router;
