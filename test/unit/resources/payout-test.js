var sinon = require('sinon');
var expect = require('expect.js');
var mockery = require('mockery');

expect = require('sinon-expect').enhance(expect, sinon, 'was');

var payoutFactory = require('../../../lib/resources/payout');
var Resource = require('../../../lib/resources/resource');

describe('Payout resource', function() {
  it('is a Resource', function() {
    expect(payoutFactory()).to.be.a(Resource);
  });

  describe('#index', function() {
    var id, payout, cb;

    beforeEach(function() {
      id = '123';
      cb = function() {};
      payout = payoutFactory(null, id);
      sinon.stub(payout, 'get');
    });

    it('delegates to #get with the correct path and callback', function() {
      var payoutsPath = '/merchants/' + id + '/payouts';
      payout.index(cb);
      expect(payout.get).was.calledWith({ path: payoutsPath }, cb);
    });
  });
});
