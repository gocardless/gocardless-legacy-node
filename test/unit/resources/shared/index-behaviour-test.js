var sinon = require('sinon');
var expect = require('expect.js');

expect = require('sinon-expect').enhance(expect, sinon, 'was');

module.exports = function cancelBehaviour(Resource) {
  describe('#index', function() {
    var id, resource, cb, resourcesPath;

    beforeEach(function() {
      id = '123';
      cb = function() {};
      resource = new Resource(null, { merchantId: id });
      resourcesPath = '/api/v1/merchants/' + id + resource.basePath;
      sinon.stub(resource, 'get');
    });

    describe('given params and a callback', function() {
      it('adds the corect path and delegates to #get', function() {
        var params = { page: 1, per_page: 20 };
        var expectedOpts = { path: resourcesPath, qs: params };

        resource.index(params, cb);

        expect(resource.get).was.calledWith(expectedOpts, cb);
      });
    });

    describe('given a callback only', function() {
      it('adds the corect path and delegates to #get', function() {
        resource.index(cb);
        expect(resource.get).was.calledWith({ path: resourcesPath }, cb);
      });
    });
  });
};
