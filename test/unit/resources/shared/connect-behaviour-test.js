var url = require('url');
var qs = require('qs');

var sinon = require('sinon');
var expect = require('expect.js');
var mockery = require('mockery');

module.exports = function connectBehaviour(resourceName, fileName) {
  fileName = (fileName || resourceName);

  describe('#newUrl', function() {
    var resource, merchantId, params, signerMock, signature, appId, appSecret,
        baseUrl;

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
      params = { amount: '10.00' };

      signature = 'ABCXYZ123789';
      appId = '123ABC';
      appSecret = '456DEF';
      baseUrl = 'http://example.com';
      merchantId = '123ABC';

      signerMock = {};
      signerMock.toQuery = sinon.stub().returns(params);
      signerMock.sign = sinon.stub().returns(signature);
      mockery.registerMock('../../helpers/request-signer', signerMock);

      var Resource = require('../../../../lib/resources/' + fileName);
      resource = new Resource(null, {
        merchantId: merchantId,
        appId: appId,
        appSecret: appSecret,
        baseUrl: baseUrl
      });
    });

    it('starts with baseUrl', function() {
      expect(resource.newUrl(params).indexOf(baseUrl)).to.be(0);
    });

    it('has the correct path', function() {
      var result = url.parse(resource.newUrl(params));
      expect(result.pathname).to.be('/connect' + resource.basePath + '/new');
    });

    describe('the query string', function() {
      var queryString, parsedQuery;

      beforeEach(function() {
        queryString = url.parse(resource.newUrl(params)).query;
        parsedQuery = qs.parse(queryString);
      });

      it('encodes the passed params and adds merchantId', function() {
        expect(parsedQuery[resource.paramName].amount).to.be(params.amount);
        expect(parsedQuery[resource.paramName].merchant_id).to.be(merchantId);
      });

      it('adds the signature', function() {
        expect(parsedQuery.signature).to.be(signature);
      });

      it('adds a unique nonce', function() {
        var otherQueryString = url.parse(resource.newUrl(params)).query;
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

      describe('non-preauth, subscription or bill parms', function() {
        beforeEach(function() {
          params = {
            amount: '10',
            state: 'id=123',
            redirect_uri: 'http://example.com/redirect',
            cancel_uri: 'http://example.com/cancel'
          };
          queryString = url.parse(resource.newUrl(params)).query;
          parsedQuery = qs.parse(queryString);
        });

        it('extracts state out of the resource params', function() {
          expect(parsedQuery.state).to.be('id=123');
          expect(parsedQuery[resource.paramName].state).to.be(undefined);
        });

        it('extracts redirect_uri out of the resource params', function() {
          expect(parsedQuery.redirect_uri).to.be('http://example.com/redirect');
          expect(parsedQuery[resource.paramName].redirect_uri).to.be(undefined);
        });

        it('extracts cancel_uri out of the resource params', function() {
          expect(parsedQuery.cancel_uri).to.be('http://example.com/cancel');
          expect(parsedQuery[resource.paramName].cancel_uri).to.be(undefined);
        });
      });
    });
  });
};
