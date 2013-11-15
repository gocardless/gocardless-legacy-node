var sinon = require('sinon');
var expect = require('expect.js');

expect = require('sinon-expect').enhance(expect, sinon, 'was');

var Merchant = require('../../../lib/resources/merchant');
var Resource = require('../../../lib/resources/resource');

describe('Merchant resource', function() {
  it('is a Resource', function() {
    expect(new Merchant()).to.be.a(Resource);
  });

  describe('#getSelf', function() {
    var id, merchant, cb;

    beforeEach(function() {
      id = '123';
      cb = function() {};
      merchant = new Merchant(null, { merchantId: id });
      sinon.stub(merchant, 'get');
    });

    it('delegates to #get with merchantId and callback', function() {
      merchant.getSelf(cb);
      expect(merchant.get).was.calledWith({ id: id }, cb);
    });
  });
});
