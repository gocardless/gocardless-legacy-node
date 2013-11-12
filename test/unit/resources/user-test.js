var sinon = require('sinon');
var expect = require('expect.js');
var mockery = require('mockery');

expect = require('sinon-expect').enhance(expect, sinon, 'was');

var indexBehaviour = require('./shared/index-behaviour-test');

var userFactory = require('../../../lib/resources/user');
var Resource = require('../../../lib/resources/resource');

describe('User resource', function() {
  it('is a Resource', function() {
    expect(userFactory()).to.be.a(Resource);
  });

  indexBehaviour(userFactory);
});
