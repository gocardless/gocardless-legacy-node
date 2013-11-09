var sinon = require('sinon');
var expect = require('expect.js');
var mockery = require('mockery');

var Client = require('../lib/client');

describe('Client', function() {
  var config;

  beforeEach(function() {
    config = { token: 'DATA', baseUrl: 'http://example.com' };

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

  it('stores config', function() {
    var client = new Client(config)
    expect(client.config).to.be(config);
  });

  function itRegistersAResource(propName, fileName) {
    fileName = (fileName || propName);

    var resourceStub;
    var resource = { resource: 'stub' };

    beforeEach(function() {
      resourceStub = sinon.stub().returns(resource);
      mockery.registerMock('./resources/' + fileName, resourceStub);
    });

    it('initializes the resource with the client instance', function() {
      var client = new Client(config);
      expect(resourceStub.args[0][0]).to.be(client);
    });

    it('exposes the resource to the client', function() {
      var client = new Client(config);
      expect(client[propName]).to.be(resource);
    });
  }

  itRegistersAResource('bill');
  itRegistersAResource('payout');
  itRegistersAResource('preAuthorization', 'pre-authorization');
  itRegistersAResource('subscription');
  itRegistersAResource('user');

  describe('#request', function() {
    var client;
    var requestMock;

    beforeEach(function() {
      requestMock = sinon.spy();
      mockery.registerMock('request', requestMock);
      client = new (require('../lib/client'))(config);
    });

    it('delegates to request library', function() {
      var opts = { some: 'options' };
      client.request(opts);
      expect(requestMock.withArgs(opts).calledOnce).to.be.ok();
    });

    it('adds Authorization header', function() {
      var opts = { some: 'options'};
      client.request(opts);
      var authHeader = 'bearer ' + config.token;

      expect(requestMock.args[0][0].headers['Authorization']).to.be(authHeader);
    });

    it('adds Accept header', function() {
      var opts = { some: 'options'};
      client.request(opts);

      expect(requestMock.args[0][0].headers['Accept']).to.be('application/json');
    });

    it('converts path option to a full uri', function() {
      var opts = { path: '/bills'};
      var expected = config.baseUrl + opts.path;

      client.request(opts);

      expect(requestMock.args[0][0].uri).to.be(expected);
    });
  });
});
