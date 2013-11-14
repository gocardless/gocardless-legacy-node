var expect = require('expect.js');

var cancelBehaviour = require('./shared/cancel-behaviour-test');
var indexBehaviour = require('./shared/index-behaviour-test');

var preAuthFactory = require('../../../lib/resources/pre-authorization');
var Resource = require('../../../lib/resources/resource');

describe('Subscription resource', function() {
  it('is a Resource', function() {
    expect(preAuthFactory()).to.be.a(Resource);
  });

  indexBehaviour(preAuthFactory);
  cancelBehaviour(preAuthFactory);
});
