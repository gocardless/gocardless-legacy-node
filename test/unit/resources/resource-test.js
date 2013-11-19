var sinon = require('sinon');
var expect = require('expect.js');

expect = require('sinon-expect').enhance(expect, sinon, 'was');

var Resource = require('../../../lib/resources/resource');

describe('Resource', function() {
  var basePath, client, opts, resource;

  beforeEach(function() {
    basePath = '/bills';
    client = { request: sinon.spy(), };
    opts = { config: 'options' };
    resource = new Resource(client, opts);
    resource.basePath = basePath;
  });

  it('keeps a reference to basePath, client and opts', function() {
    expect(resource.basePath).to.be(basePath);
    expect(resource.client).to.be(client);
    expect(resource.opts).to.be(opts);
  });

  function itDelegatesToClient(fnName, httpMethod) {
    describe('with an id', function() {
      it('calls client#request with method argument', function() {
        resource[fnName]({ id: 1 });
        expect(client.request.args[0][0].method).to.be(httpMethod);
      });

      it('calls client#request with path and id', function() {
        var expectedPath = '/api/v1' + basePath + '/' + 1;
        resource[fnName]({ id: 1 });
        expect(client.request.args[0][0].path).to.be(expectedPath);
      });

      it('passes the callback to the request', function() {
        function cb() {}
        resource[fnName](1, cb);
        expect(client.request.args[0][1]).to.be(cb);
      });
    });

    describe('with no id', function() {
      it('requests the index', function() {
        resource[fnName]();
        expect(client.request.args[0][0].path).to.be('/api/v1' + basePath);
      });

      it('passes the callback to the request', function() {
        function cb() {}
        resource[fnName](cb);
        expect(client.request.args[0][1]).to.be(cb);
      });
    });

    it('accepts a path option', function() {
      var path = '/some/other/path';
      resource[fnName]({ path: path });
      expect(client.request).was.calledWith({ method: httpMethod, path: path });
    });
  }

  describe('#get', function() {
    itDelegatesToClient('get', 'GET');
  });

  describe('#put', function() {
    itDelegatesToClient('put', 'PUT');

    it('passes JSON params', function() {
      var params = { some: 'params' };
      resource.put({ id: 1, json: params });
      expect(client.request.args[0][0].json).to.be(params);
    });
  });

  describe('#post', function() {
    itDelegatesToClient('post', 'POST');

    it('passes JSON params', function() {
      var params = { some: 'params' };
      resource.post({ id: 1, json: params });
      expect(client.request.args[0][0].json).to.be(params);
    });
  });

  describe('#del', function() {
    itDelegatesToClient('del', 'DELETE');
  });

  describe('#find', function() {
    beforeEach(function() {
      sinon.spy(resource, 'get');
    });

    afterEach(function() {
      resource.get.restore();
    });

    it('delegates to #get', function() {
      function cb() {}
      resource.find(1, cb);

      expect(resource.get.args[0][0].id).to.be(1);
      expect(resource.get.args[0][1]).to.be(cb);
    });
  });
});
