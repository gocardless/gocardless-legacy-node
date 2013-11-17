var url = require('url');

var sinon = require('sinon');
var expect = require('expect.js');
var mockery = require('mockery');
var qs = require('qs');

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

  describe('#newUrl', function() {
    var billParams, signerMock, signature, appId, appSecret, baseUrl;

    beforeEach(function() {
      billParams = {
        merchantId: id,
        amount: '10.00'
      };

      signature = 'ABCXYZ123789';
      appId = '123ABC';
      appSecret = '456DEF';
      baseUrl = 'http://example.com';

      signerMock = {};
      signerMock.toQuery = sinon.stub().returns(billParams);
      signerMock.sign = sinon.stub().returns(signature);
      mockery.registerMock('../helpers/request-signer', signerMock);

      Bill = require('../../../lib/resources/bill');
      bill = new Bill(null, {
        merchantId: id,
        appId: appId,
        appSecret: appSecret,
        baseUrl: baseUrl
      });
    });

    it('starts with baseUrl', function() {
      expect(bill.newUrl(billParams).indexOf(baseUrl)).to.be(0);
    });

    it('has the correct path', function() {
      var result = url.parse(bill.newUrl(billParams));
      expect(result.pathname).to.be('/connect/bills/new');
    });

    describe('the query string', function() {
      var queryString, parsedQuery;

      beforeEach(function() {
        queryString = url.parse(bill.newUrl(billParams)).query;
        parsedQuery = qs.parse(queryString);
      });

      it('encodes the passed params and adds merchantId', function() {
        expect(parsedQuery.bill.amount).to.be(billParams.amount);
        expect(parsedQuery.bill.merchantId).to.be(id);
      });

      it('adds the signature', function() {
        expect(parsedQuery.signature).to.be(signature);
      });

      it('adds a unique nonce', function() {
        var otherQueryString = url.parse(bill.newUrl(billParams)).query;
        var otherParsedQuery = qs.parse(otherQueryString);

        expect(parsedQuery.nonce).not.to.eql(undefined);
        expect(otherParsedQuery.nonce).not.to.eql(undefined);
        expect(otherParsedQuery.nonce).not.to.eql(parsedQuery.nonce);
      });

      it('adds the client id and timestamp', function() {
        var crazyISODateRegex = /^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*)?)([zZ]|([+\-])(\d\d):(\d\d))?$/;
        expect(parsedQuery.client_id).to.be(appId);
        expect(parsedQuery.timestamp).to.match(crazyISODateRegex);
      });
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
