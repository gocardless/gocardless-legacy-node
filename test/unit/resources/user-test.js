var expect = require('expect.js');

var indexBehaviour = require('./shared/index-behaviour-test');

var User = require('../../../lib/resources/user');
var Resource = require('../../../lib/resources/resource');

describe('User resource', function() {
  it('is a Resource', function() {
    expect(new User()).to.be.a(Resource);
  });

  indexBehaviour(User);
});
