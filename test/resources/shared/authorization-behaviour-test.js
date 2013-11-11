var sinon = require('sinon');
var expect = require('expect.js');

expect = require('sinon-expect').enhance(expect, sinon, 'was');

module.exports = function authorizationBehaviour(resourceFactory) {
  describe('#index', function() {
    var id, resource, cb;

    beforeEach(function() {
      id = '123';
      cb = function() {};
      resource = resourceFactory(null, id);
      sinon.stub(resource, 'get');
    });

    it('delegates to #get with the correct path and callback', function() {
      var resourcesPath = '/merchants/' + id + resource.basePath;
      resource.index(cb);
      expect(resource.get).was.calledWith({ path: resourcesPath }, cb);
    });
  });

  describe('#cancel', function() {
    var id, resource, cb;

    beforeEach(function() {
      id = '123';
      cb = function() {};
      resource = resourceFactory(null);
      sinon.stub(resource, 'put');
    });

    it('delegates to #put with the correct path and callback', function() {
      var cancelPath = resource.basePath + '/' + id + '/cancel';
      resource.cancel({ id: id }, cb);
      expect(resource.put).was.calledWith({ path: cancelPath }, cb);
    });
  });
};
