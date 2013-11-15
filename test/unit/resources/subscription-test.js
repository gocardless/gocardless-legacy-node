var expect = require('expect.js');

var cancelBehaviour = require('./shared/cancel-behaviour-test');
var indexBehaviour = require('./shared/index-behaviour-test');

var Subscription = require('../../../lib/resources/subscription');
var Resource = require('../../../lib/resources/resource');

describe('Subscription resource', function() {
  it('is a Resource', function() {
    expect(new Subscription()).to.be.a(Resource);
  });

  indexBehaviour(Subscription);
  cancelBehaviour(Subscription);
});
