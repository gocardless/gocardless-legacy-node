var sinon = require('sinon');
var expect = require('expect.js');
var mockery = require('mockery');

expect = require('sinon-expect').enhance(expect, sinon, 'was');

var billFactory = require('../../../lib/resources/bill');
var Resource = require('../../../lib/resources/resource');

describe('Bill resource', function() {
  it('is a Resource', function() {
    expect(billFactory()).to.be.a(Resource);
  });

  describe('#index', function() {
    var id, bill, cb;

    beforeEach(function() {
      id = '123';
      cb = function() {};
      bill = billFactory(null, id);
      sinon.stub(bill, 'get');
    });

    it('delegates to #get with the correct path and callback', function() {
      var billsPath = '/merchants/' + id + '/bills';
      bill.index(cb);
      expect(bill.get).was.calledWith({ path: billsPath }, cb);
    });
  });
});
