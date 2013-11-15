var sinon = require('sinon');
var expect = require('expect.js');
var mockery = require('mockery');

expect = require('sinon-expect').enhance(expect, sinon, 'was');

var indexBehaviour = require('./shared/index-behaviour-test');

var Bill = require('../../../lib/resources/bill');
var Resource = require('../../../lib/resources/resource');

describe('Bill resource', function() {
  var bill, id, cb;

  beforeEach(function() {
    mockery.enable({
      warnOnUnregistered: false,
      warnOnReplace: false,
      useCleanCache: true
    });
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.resetCache();
    mockery.disable();
  });

  beforeEach(function() {
    cb = function() {};
    id = '123';
    bill = new Bill(null, { merchantId: id});
  });

  it('is a Resource', function() {
    expect(bill).to.be.a(Resource);
  });

  indexBehaviour(Bill);

  describe('#create', function() {
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

  describe('#createOneOff', function() {
    var billParams, signerMock, signature;

    beforeEach(function() {
      billParams = {
        merchant_id: id,
        amount: '10.00'
      };

      signature = 'ABCXYZ123789';

      signerMock = {};
      signerMock.toQuery = sinon.stub().returns(billParams);
      signerMock.sign = sinon.stub().returns(signature);
      mockery.registerMock('../helpers/request-signer', signerMock);

      Bill = require('../../../lib/resources/bill');
      bill = new Bill(null, { merchantId: id });

      sinon.stub(bill, 'get');
    });

    it('delegates to #get with signed query params and callback', function() {
      var expectedQuery = { bill: billParams, signature: signature };

      bill.createOneOff(billParams, cb);

      expect(bill.get).was.calledWith({
        qs: expectedQuery,
        path: '/connect/bills/new'
      }, cb);
    });
  });

  describe('#retry', function() {
    beforeEach(function() {
      sinon.stub(bill, 'post');
    });

    it('delegates to #post with the correct path and callback', function() {
      var retryPath = '/api/v1/bills/' + id + '/retry';
      bill.retry({ id: id }, cb);
      expect(bill.post).was.calledWith({ path: retryPath }, cb);
    });
  });
});
