var express = require('express');
var router = express.Router();
var storage = require('node-persist');
var _ = require('lodash');
var students = storage.getItem('students') || [];
var notes = storage.getItem('notes') || [];
var utils = require('../helpers/utils');

var clearNotesProperties = function (student) {
  return _.pick(student, ['id','student_id','course','grade']);
};

var validateNoteIdProperty = function (note) {
  return note.hasOwnProperty('id');
};

var validateNoteNameProperty = function (note) {
  return note.hasOwnProperty('student_id');
};

var validateNoteAgeProperty = function (note) {
  return note.hasOwnProperty('course');
};

var validateNoteGradeProperty = function (note) {
  return note.hasOwnProperty('grade');
};

var validateNoteProperties = function (note) {
  if (!validateNoteNameProperty(note) ||
      !validateNoteAgeProperty(note) ||
      !validateNoteGradeProperty(note)) {
    return false;
  }
  return true;
};

var validateNoteAllPatchProperties = function (note) {
  if (validateNoteNameProperty(note) &&
      validateNoteAgeProperty(note) &&
      validateNoteGradeProperty(note)) {
    return false;
  }
  return true;
};

var validateNoteNonPatchProperties = function (note) {
  if (!validateNoteNameProperty(note) &&
      !validateNoteAgeProperty(note) &&
      !validateNoteGradeProperty(note)) {
    return false;
  }
  return true;
};

router.get('/', function(req, res, next) {
  res.type('application/json');
  res.send(notes);
});

router.get('/:student_id', function(req, res, next) {
  res.type('application/json');
  var student_id = req.params.student_id;
  if (!student_id) {
    return utils.notValidErrorResponse(res);
  }
  if (!students.length) {
    return utils.notFoundErrorResponse(res);
  }
  var student = utils.getEntityFromCollection(student_id, students);
  if (!student) {
    return utils.notFoundErrorResponse(res);
  }
  var studentNotes = _.filter(notes, function (note) { return note.student_id == student_id });
  res.send(studentNotes);
});

router.post('/:student_id', function(req, res, next) {
  res.type('application/json');
  var student_id = req.params.student_id;
  if (!student_id) {
    return utils.notValidErrorResponse(res);
  }
  var note = clearNotesProperties(req.body);
  if (validateNoteIdProperty(note)) {
    return utils.notValidErrorResponse(res);
  }
  if (!validateNoteProperties(note)) {
    return utils.notValidErrorResponse(res);
  }
  var student = utils.getEntityFromCollection(student_id, students);
  if (!student) {
    return utils.notFoundErrorResponse(res);
  }
  note.id = utils.createEntityId(notes);
  note.student_id = student_id;
  notes.push(note);
  storage.setItem('notes', notes);
  return utils.createdResponse(res);
});

router.put('/:student_id', function(req, res, next) {
  res.type('application/json');
  var student_id = req.params.student_id;
  if (!student_id) {
    return utils.notValidErrorResponse(res);
  }
  var noteUpdate = clearNotesProperties(req.body);
  if (!validateNoteProperties(noteUpdate)) {
    return utils.notValidErrorResponse(res);
  }
  noteUpdate.student_id = student_id;
  if (!notes.length) {
    return utils.notFoundErrorResponse(res);
  }
  var student = utils.getEntityFromCollection(student_id, students);
  if (!student) {
    return utils.notFoundErrorResponse(res);
  }
  var studentNote = _.find(notes, function (note) { return note.student_id == student_id && note.course == noteUpdate.course; });
  if (!studentNote) {
    return utils.notFoundErrorResponse(res);
  }
  var studentUpdated = _.merge(studentNote, noteUpdate),
      position = utils.getEntityPositionFromCollection(studentNote.id, notes);
  notes[position] = studentUpdated;
  storage.setItem('notes', notes);
  return utils.updatedResponse(res);
});

router.patch('/', function(req, res, next) {
  res.type('application/json');
  var student_id = req.params.student_id;
  if (!student_id) {
    return utils.notValidErrorResponse(res);
  }
  var noteUpdate = clearNotesProperties(req.body);
  if (!validateNoteProperties(noteUpdate)) {
    return utils.notValidErrorResponse(res);
  }
  noteUpdate.student_id = student_id;
  if (!notes.length) {
    return utils.notFoundErrorResponse(res);
  }
  var student = utils.getEntityFromCollection(student_id, students);
  if (!student) {
    return utils.notFoundErrorResponse(res);
  }
  var studentNote = _.find(notes, function (note) { return note.student_id == student_id && note.course == noteUpdate.course; });
  if (!studentNote) {
    return utils.notFoundErrorResponse(res);
  }
  var studentUpdated = _.merge(studentNote, noteUpdate),
      position = utils.getEntityPositionFromCollection(studentNote.id, notes);
  notes[position] = studentUpdated;
  storage.setItem('notes', notes);
  return utils.updatedResponse(res);
});

module.exports = router;
