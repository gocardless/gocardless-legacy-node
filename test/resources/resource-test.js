var sinon = require('sinon');
var expect = require('expect.js');

var Resource = require('../../lib/resources/resource');

describe('Resource', function() {
  var basePath, client, resource;

  beforeEach(function() {
    basePath = '/bills';
    client = { request: sinon.spy(), };
    resource = new Resource(basePath, client);
  });

  it('keeps a reference to basePath and client', function() {
    expect(resource.basePath).to.be(basePath);
    expect(resource.client).to.be(client);
  });

  function itDelegatesToClient(fnName, httpMethod) {
    it('calls client#request with method argument', function() {
      resource[fnName](1);
      expect(client.request.args[0][0].method).to.be(httpMethod);
    });

    it('calls client#request with path and id', function() {
      resource[fnName](1);
      expect(client.request.args[0][0].path).to.be(basePath + '/' + 1);
    });
  }

  describe('#get', function() {
    itDelegatesToClient('get', 'GET');
  });

  describe('#put', function() {
    itDelegatesToClient('put', 'PUT');

    it('passes JSON params', function() {
      var params = { some: 'params' };
      resource.put(1, params);
      expect(client.request.args[0][0].json).to.be(params);
    });
  });

  describe('#post', function() {
    itDelegatesToClient('post', 'POST');

    it('passes stringified params', function() {
      var params = { some: 'params' };
      resource.put(1, params);
      expect(client.request.args[0][0].json).to.be(params);
    });
  });

  describe('#del', function() {
    itDelegatesToClient('del', 'DELETE');
  });
});
