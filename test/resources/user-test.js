var sinon = require('sinon');
var expect = require('expect.js');
var mockery = require('mockery');

expect = require('sinon-expect').enhance(expect, sinon, 'was');

var userFactory = require('../../lib/resources/user');
var Resource = require('../../lib/resources/resource');

describe('User resource', function() {
  it('is a Resource', function() {
    expect(userFactory()).to.be.a(Resource);
  });

  describe('#index', function() {
    var id, user, cb;

    beforeEach(function() {
      id = '123';
      cb = function() {};
      user = userFactory(null, id);
      sinon.stub(user, 'get');
    });

    it('delegates to #get with the correct path and callback', function() {
      var usersPath = '/merchants/' + id + '/users';
      user.index(cb);
      expect(user.get).was.calledWith({ path: usersPath }, cb);
    });
  });
});
