var expect = require('expect.js');

var Signer = require('../../../lib/helpers/request-signer');

describe('Signer', function() {
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
});
