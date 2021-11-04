'use strict';
const mongoose = require('mongoose');
const issueSchema = require('../mongoose.js').issueSchema;
const getIssues = require('../mongoose.js').getIssues;
const postIssue = require('../mongoose.js').postIssue;
const updateIssue = require('../mongoose.js').updateIssue;
const deleteIssue = require('../mongoose.js').deleteIssue;
module.exports = function(app) {
  app.route('/api/issues/:project')
  .get(function (req, res){
    let project = req.params.project;
    const Model = mongoose.model(`${project}`, issueSchema);
    getIssues(Model, req.query, (err, arr) => {
      res.send(arr);
    });
  })
  .post(function (req, res){
    const obj = req.body;
    if (!obj.hasOwnProperty('issue_title') ||
    !obj.hasOwnProperty('issue_text') ||
    !obj.hasOwnProperty('created_by')) {
     return res.json({error: 'required field(s) missing'});
    }
    let project = req.params.project;
    const Model = mongoose.model(`${project}`, issueSchema);
    postIssue(Model, obj, (err, doc) => {
      res.json(doc);
    });
  })
  .put(function (req, res){
    const obj = req.body;
    if (!obj.hasOwnProperty('_id')) return res.json({error: 'missing _id'});
    if (obj._id.length !== 24) return res.json({error:'could not update',_id: obj._id});
    if (Object.keys(obj).length === 1) return res.json({error: 'no update field(s) sent', _id: obj._id});
    let project = req.params.project;
    const Model = mongoose.model(`${project}`, issueSchema);
    updateIssue(Model, obj, (err, data) => {
      if (data.modifiedCount === 0) return res.json({error:'could not update',_id: obj._id});
      res.json({result:'successfully updated', _id: obj._id});
    });
  })
  .delete(function (req, res){
    const obj = req.body;
    if (!obj.hasOwnProperty('_id')) return res.json({error: 'missing _id'})
    if (obj._id.length !== 24) return res.json({error:'could not delete',_id: obj._id});
    let project = req.params.project;
    const Model = mongoose.model(`${project}`, issueSchema);
    deleteIssue(Model, obj._id, (err, data) => {
      if (data === null) return res.json({error:'could not delete',_id: obj._id});
      res.json({result:'successfully deleted', _id: obj._id});
    });
  });
}
