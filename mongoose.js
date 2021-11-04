const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema(
  {
    issue_title: {type: String, default: ''},
    issue_text: {type: String, default: ''},
    created_by: {type: String, default: ''},
    assigned_to: {type: String, default: ''},
    status_text: {type: String, default: ''},
    open: {type: Boolean, default: true},
    created_on: {type: String, default: new Date().toISOString()},
    updated_on: {type: String, default: new Date().toISOString()}
  }, {versionKey: false});

const getIssues = (Model, obj, done) => {
  Model.find(obj, (err, docs) => {
    if (err) return console.error(err);
    done(null, docs);
  });
}

const postIssue = (Model, obj, done) => {
  Model.create({
    issue_title: obj.issue_title,
    issue_text: obj.issue_text,
    created_by: obj.created_by,
    assigned_to: obj.assigned_to,
    status_text: obj.status_text
  }, (err, data) => {
    if (err) return console.error(err);
    data.save((err, doc) => {
      if (err) console.error(err);
      done(null, doc);
    });
  });
}

const updateIssue = (Model, obj, done) => {
  obj.updated_on = new Date().toISOString();
  Model.updateOne({_id: mongoose.Types.ObjectId(obj._id)}, obj, (err, data) => {
    if (err) return console.error(err);
    done(null, data);
  });
}

const deleteIssue = (Model, id, done) => {
  Model.findOneAndRemove(
    {_id: mongoose.Types.ObjectId(id)},
    (err, data) => {
      if (err) return console.error(err);
      done(null, data);
  });
}

exports.issueSchema = issueSchema;
exports.getIssues = getIssues;
exports.postIssue = postIssue;
exports.updateIssue = updateIssue;
exports.deleteIssue = deleteIssue;