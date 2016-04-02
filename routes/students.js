var express = require('express');
var router = express.Router();
var storage = require('node-persist');
var _ = require('lodash');
var students = storage.getItem('students') || [];
var utils = require('../helpers/utils');

var clearStudentProperties = function (student) {
  return _.pick(student, ['id','name','age','grade']);
};

var validateStudentIdProperty = function (student) {
  return student.hasOwnProperty('id');
};

var validateStudentNameProperty = function (student) {
  return student.hasOwnProperty('name');
};

var validateStudentAgeProperty = function (student) {
  return student.hasOwnProperty('age');
};

var validateStudentGradeProperty = function (student) {
  return student.hasOwnProperty('grade');
};

var validateStudentProperties = function (student) {
  if (!validateStudentNameProperty(student) ||
      !validateStudentAgeProperty(student) ||
      !validateStudentGradeProperty(student)) {
    return false;
  }
  return true;
};

var validateStudentAllPatchProperties = function (student) {
  if (validateStudentNameProperty(student) &&
      validateStudentAgeProperty(student) &&
      validateStudentGradeProperty(student)) {
    return false;
  }
  return true;
};

var validateStudentNonPatchProperties = function (student) {
  if (!validateStudentNameProperty(student) &&
      !validateStudentAgeProperty(student) &&
      !validateStudentGradeProperty(student)) {
    return false;
  }
  return true;
};

router.get('/', function(req, res, next) {
  res.type('application/json');
  res.send(students);
});

router.post('/', function(req, res, next) {
  res.type('application/json');
  var student = clearStudentProperties(req.body);
  if (validateStudentIdProperty(student)) {
    return utils.notValidErrorResponse(res);
  }
  if (!validateStudentProperties(student)) {
    return utils.notValidErrorResponse(res);
  }
  student.id = utils.createEntityId(students);
  students.push(student);
  storage.setItem('students', students);
  return utils.createdResponse(res);
});

router.put('/:id', function(req, res, next) {
  res.type('application/json');
  var id = req.params.id;
  if (!id) {
    return utils.notValidErrorResponse(res);
  }
  var studentUpdate = clearStudentProperties(req.body);
  if (!validateStudentIdProperty(studentUpdate)) {
    return utils.notValidErrorResponse(res);
  }
  studentUpdated.id = id;
  if (!validateStudentProperties(studentUpdate)) {
    return utils.notValidErrorResponse(res);
  }
  if (!students.length) {
    return utils.notFoundErrorResponse(res);
  }
  var student = utils.getEntityFromCollection(id, students);
  if (!student) {
    return utils.notFoundErrorResponse(res);
  }
  var position = utils.getEntityPositionFromCollection(id, students);
  students[position] = studentUpdate;
  storage.setItem('students', students);
  return utils.updatedResponse(res);
});

router.patch('/:id', function(req, res, next) {
  res.type('application/json');
  var id = req.params.id;
  if (!id) {
    return utils.notValidErrorResponse(res);
  }
  var studentUpdate = clearStudentProperties(req.body);
  if (!validateStudentIdProperty(studentUpdate)) {
    return utils.notValidErrorResponse(res);
  }
  studentUpdated.id = id;
  if (!validateStudentAllPatchProperties(studentUpdate)) {
    return utils.notValidErrorResponse(res);
  }
  if (!validateStudentNonPatchProperties(studentUpdate)) {
    return utils.notValidErrorResponse(res);
  }
  if (!students.length) {
    return utils.notFoundErrorResponse(res);
  }
  var student = utils.getEntityFromCollection(id, students);
  if (!student) {
    return utils.notFoundErrorResponse(res);
  }
  var studentUpdated = _.merge(student, studentUpdate),
      position = utils.getEntityPositionFromCollection(id, students);
  students[position] = studentUpdated;
  storage.setItem('students', students);
  return utils.updatedResponse(res);
});

router.delete('/:id', function(req, res, next) {
  res.type('application/json');
  var id = req.params.id;
  if (!id) {
    return utils.notValidErrorResponse(res);
  }
  if (!students.length) {
    return utils.notFoundErrorResponse(res);
  }
  var student = utils.getEntityFromCollection(id, students);
  if (!student) {
    return utils.notFoundErrorResponse(res);
  }
  var position = utils.getEntityPositionFromCollection(id, students);
  students.splice(position,1);
  storage.setItem('students', students);
  return utils.deletedResponse(res);
});

module.exports = router;
