var sinon = require('sinon');
var expect = require('expect.js');

expect = require('sinon-expect').enhance(expect, sinon, 'was');

module.exports = function cancelBehaviour(resourceFactory) {
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
};
