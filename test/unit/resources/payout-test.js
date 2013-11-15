var expect = require('expect.js');

var indexBehaviour = require('./shared/index-behaviour-test');

var Payout = require('../../../lib/resources/payout');
var Resource = require('../../../lib/resources/resource');

describe('Payout resource', function() {
  it('is a Resource', function() {
    expect(new Payout()).to.be.a(Resource);
  });

  indexBehaviour(Payout);
});
