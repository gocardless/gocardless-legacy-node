var sinon = require('sinon');
var expect = require('expect.js');
var mockery = require('mockery');

var Client = require('../../lib/client');

describe('Client', function() {
  var config;

  beforeEach(function() {
    config = { token: 'DATA', baseUrl: 'http://example.com/api' };

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
    var client = new Client(config);
    expect(client.config).to.be(config);
  });

  function itRegistersAResource(propName, fileName) {
    var constructor;
    fileName = (fileName || propName);

    beforeEach(function() {
      constructor = require('../../lib/resources/' + fileName);
    });

    it('initializes the resource with the client instance', function() {
      var client = new Client(config);
      expect(client[propName].client).to.be(client);
    });

    it('initializes the resource with merchant ID', function() {
      var client = new Client(config);
      expect(client[propName].opts.merchant_id).to.be(config.merchant_id);
    });
  }

  itRegistersAResource('bill');
  // itRegistersAResource('user');
  // itRegistersAResource('payout');
  // itRegistersAResource('merchant');
  // itRegistersAResource('subscription');
  // itRegistersAResource('preAuthorization', 'pre-authorization');

  describe('#request', function() {
    var client;
    var requestMock;

    beforeEach(function() {
      requestMock = sinon.spy();
      mockery.registerMock('request', requestMock);
      client = new (require('../../lib/client'))(config);
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

      expect(requestMock.args[0][0].headers.Authorization).to.be(authHeader);
    });

    it('adds Accept header', function() {
      var opts = { some: 'options'};
      client.request(opts);

      expect(requestMock.args[0][0].headers.Accept).to.be('application/json');
    });

    it('converts path option to a full uri', function() {
      var opts = { path: '/bills'};
      var expected = config.baseUrl + opts.path;

      client.request(opts);

      expect(requestMock.args[0][0].uri).to.be(expected);
    });

    it('passes the callback to the request', function() {
      function cb() {}
      client.request({}, cb);
      expect(requestMock.args[0][1]).to.be(cb);
    });
  });
});
