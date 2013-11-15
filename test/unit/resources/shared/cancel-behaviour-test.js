var sinon = require('sinon');
var expect = require('expect.js');

expect = require('sinon-expect').enhance(expect, sinon, 'was');

module.exports = function authorizationBehaviour(Resource) {
  describe('#cancel', function() {
    var id, resource, cb;

    beforeEach(function() {
      id = '123';
      cb = function() {};
      resource = new Resource(null);
      sinon.stub(resource, 'put');
    });

    it('delegates to #put with the correct path and callback', function() {
      var cancelPath = '/api/v1' + resource.basePath + '/' + id + '/cancel';
      resource.cancel({ id: id }, cb);
      expect(resource.put).was.calledWith({ path: cancelPath }, cb);
    });
  });
};
