var sinon = require('sinon');
var expect = require('expect.js');
var mockery = require('mockery');

expect = require('sinon-expect').enhance(expect, sinon, 'was');

var Signer = require('../../../lib/helpers/request-signer');

describe('Signer', function() {
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

  describe('#toQuery', function() {
    describe('given a regular hash', function() {
      it('converts to key value pairs joined by a =', function() {
        expect(Signer.toQuery({ some: 'data' })).to.be('some=data');
      });
    });

    describe('given a hash with an array value', function() {
      it('encodes arrays', function() {
        var params = { some: ['array', 'data'] };
        var expected = 'some%5B%5D=array&some%5B%5D=data';
        expect(Signer.toQuery(params)).to.eql(expected);
      });
    });

    describe('given a hash with an array value containing a hash', function() {
      it('encodes the nested hash', function() {
        var params = { some: [{ nested: 'data' }] };
        var expected = 'some%5B%5D%5Bnested%5D=data';
        expect(Signer.toQuery(params)).to.eql(expected);
      });
    });

    describe('given a multi-level nesterd array', function() {
      it('encodes the nested hash', function() {
        var params = { a: ['mad', ['data', 'structure']] };
        var expected = 'a%5B%5D=mad&a%5B%5D%5B%5D=data&a%5B%5D%5B%5D=structure';
        expect(Signer.toQuery(params)).to.eql(expected);
      });
    });
  });

  describe('#signature', function() {
    var crypto, secret, query;

    beforeEach(function() {
      secret = 'supersecuresecret';
      query = 'key=val';

      crypto = {};
      crypto.createHmac = sinon.stub().returns(crypto);
      crypto.update = sinon.stub().returns(crypto);
      crypto.digest = sinon.stub().returns(crypto);

      mockery.registerMock('crypto', crypto);
      Signer = require('../../../lib/helpers/request-signer');
    });

    // TODO: There must be a better way to test this
    it('does a huge stubbed method chain', function() {
      Signer.signature(query, secret);

      expect(crypto.createHmac).was.calledWith('sha256', secret);
      expect(crypto.update).was.calledWith(query);
      expect(crypto.digest).was.calledWith('hex');

      sinon.assert.callOrder(crypto.createHmac, crypto.update, crypto.digest);
    });
  });
});
