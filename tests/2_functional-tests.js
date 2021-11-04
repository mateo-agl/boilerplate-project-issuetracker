const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let id;

suite('Functional Tests', function() {
  suite('POST requests', () => {
    test('POST request with all fields', (done) => {
      chai
      .request(server)
      .post('/api/issues/test/')
      .send(
        {
          issue_title: 'test',
          issue_text: 'text',
          created_by: 'me',
          assigned_to: '',
          status_text: ''
        }
      )
      .end((err, res) => {
        assert.containsAllKeys(res.body, ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text']);
        done();
      });
    });
    test('POST request with all required fields', (done) => {
      chai
      .request(server)
      .post('/api/issues/test/')
      .send({issue_title: '', issue_text: '', created_by: ''})
      .end((err, res) => {
        assert.containsAllKeys(res.body, ['issue_title', 'issue_text', 'created_by']);
        done();
      });
    });
    test('POST request with missing required fields', (done) => {
      chai
      .request(server)
      .post('/api/issues/test/')
      .send({assigned_to: '', status_text: ''})
      .end((err, res) => {
        assert.propertyVal(res.body, 'error', 'required field(s) missing');
        done();
      });
    });
  });
  suite('GET requests', () => {
    test('View issues in one project', (done) => {
      chai
      .request(server)
      .get('/api/issues/test/')
      .end((err, res) => {
        assert.isArray(res.body);
        done();
      });
    });
    test('View issues on a project with one filter', (done) => {
      chai
      .request(server)
      .get('/api/issues/test?issue_title=test')
      .end((err, res) => {
        id = res.body[0]._id;
        assert.propertyVal(res.body[0], 'issue_title', 'test');
        done();
      });
    });
    test('View issues on a project with multiple filters', (done) => {
      chai
      .request(server)
      .get('/api/issues/test?issue_title=test&issue_text=text')
      .end((err, res) => {
        assert.propertyVal(res.body[0], 'issue_title', 'test');
        assert.propertyVal(res.body[0], 'issue_text', 'text');
        done();
      });
    });
  });
  suite('PUT requests', () => {
    test('Update one field on an issue', (done) => {
      chai
      .request(server)
      .put('/api/issues/test/')
      .send({_id: id, assigned_to: 'someone'})
      .end((err, res) => {
        assert.propertyVal(res.body, 'result', 'successfully updated');
        assert.propertyVal(res.body, '_id', id);
        done();
      });
    });
    test('Update multiple fields on an issue', (done) => {
      chai
      .request(server)
      .put('/api/issues/test/')
      .send({_id: id, status_text: 'text', issue_title: 'title'})
      .end((err, res) => {
        assert.propertyVal(res.body, 'result', 'successfully updated');
        assert.propertyVal(res.body, '_id', id);
        done();
      });
    });
    test('Update an issue with missing _id', (done) => {
      chai
      .request(server)
      .put('/api/issues/test/')
      .send({created_by: ''})
      .end((err, res) => {
        assert.propertyVal(res.body, 'error', 'missing _id');
        done();
      });
    });
    test('Update an issue with no fields to update', (done) => {
      chai
      .request(server)
      .put('/api/issues/test/')
      .send({_id: id})
      .end((err, res) => {
        assert.propertyVal(res.body, 'error', 'no update field(s) sent');
        assert.propertyVal(res.body, '_id', id);
        done();
      });
    });
    test('Update an issue with an invalid _id', (done) => {
      chai
      .request(server)
      .put('/api/issues/test/')
      .send({_id: '123', created_by: ''})
      .end((err, res) => {
        assert.propertyVal(res.body, 'error', 'could not update');
        assert.propertyVal(res.body, '_id', '123');
        done();
      });
    });
  });
  suite('DELETE requests', () => {
    test('Delete an issue', (done) => {
      chai
      .request(server)
      .delete('/api/issues/test/')
      .send({_id: id})
      .end((err, res) => {
        assert.propertyVal(res.body, 'result', 'successfully deleted');
        assert.propertyVal(res.body, '_id', id);
        done();
      });
    });
    test('Delete an issue with an invalid _id', (done) => {
      chai
      .request(server)
      .delete('/api/issues/test/')
      .send({_id: '123'})
      .end((err, res) => {
        assert.propertyVal(res.body, 'error', 'could not delete');
        assert.propertyVal(res.body, '_id', '123');
        done();
      });
    });
    test('Delete an issue with missing _id', (done) => {
      chai
      .request(server)
      .delete('/api/issues/test/')
      .send({})
      .end((err, res) => {
        assert.propertyVal(res.body, 'error', 'missing _id');
        done();
      });
    });
  });
});
