var sinon = require('sinon');
var expect = require('expect.js');
var mockery = require('mockery');

expect = require('sinon-expect').enhance(expect, sinon, 'was');

var subscriptionFactory = require('../../lib/resources/subscription');
var Resource = require('../../lib/resources/resource');

describe('Subscription resource', function() {
  it('is a Resource', function() {
    expect(subscriptionFactory()).to.be.a(Resource);
  });

  describe('#index', function() {
    var id, subscription, cb;

    beforeEach(function() {
      id = '123';
      cb = function() {};
      subscription = subscriptionFactory(null, id);
      sinon.stub(subscription, 'get');
    });

    it('delegates to #get with the correct path and callback', function() {
      var subscriptionsPath = '/merchants/' + id + '/subscriptions';
      subscription.index(cb);
      expect(subscription.get).was.calledWith({ path: subscriptionsPath }, cb);
    });
  });
});
