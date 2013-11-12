var sinon = require('sinon');
var expect = require('expect.js');
var mockery = require('mockery');

expect = require('sinon-expect').enhance(expect, sinon, 'was');

var billFactory = require('../../../lib/resources/bill');
var Resource = require('../../../lib/resources/resource');

describe('Bill resource', function() {
  var bill, id, cb;

  beforeEach(function() {
    cb = function() {};
    id = '123';
    bill = billFactory(null, id);
  });

  it('is a Resource', function() {
    expect(billFactory()).to.be.a(Resource);
  });

  describe('#index', function() {
    beforeEach(function() {
      sinon.stub(bill, 'get');
    });

    it('delegates to #get with the correct path and callback', function() {
      var billsPath = '/merchants/' + id + '/bills';
      bill.index(cb);
      expect(bill.get).was.calledWith({ path: billsPath }, cb);
    });
  });

  describe('#crete', function() {
    beforeEach(function() {
      sinon.stub(bill, 'post');
    });

    it('delegates to #post with nested params and callback', function() {
      var params = {
        amount: '10.00',
        pre_authorization_id: '123ABC'
      };

      bill.create(params, cb);
      expect(bill.post).was.calledWith({ json: { bill: params } }, cb);
    });
  });
});
