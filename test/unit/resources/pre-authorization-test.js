var sinon = require('sinon');
var expect = require('expect.js');
var mockery = require('mockery');

expect = require('sinon-expect').enhance(expect, sinon, 'was');
var authorizationBehaviour = require('./shared/authorization-behaviour-test');

var preAuthFactory = require('../../../lib/resources/pre-authorization');
var Resource = require('../../../lib/resources/resource');

describe('Subscription resource', function() {
  it('is a Resource', function() {
    expect(preAuthFactory()).to.be.a(Resource);
  });

  authorizationBehaviour(preAuthFactory);
});
