var expect = require('expect.js');

var indexBehaviour = require('./shared/index-behaviour-test');

var payoutFactory = require('../../../lib/resources/payout');
var Resource = require('../../../lib/resources/resource');

describe('Payout resource', function() {
  it('is a Resource', function() {
    expect(payoutFactory()).to.be.a(Resource);
  });

  indexBehaviour(payoutFactory);
});
