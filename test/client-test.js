var sinon = require('sinon');
var expect = require('expect.js');
var mockery = require('mockery');

var Client = require('../lib/client');

describe('Client', function() {
  beforeEach(function() {
    mockery.enable({
      warnOnUnregistered: false,
      useCleanCache: true
    });
  });

  afterEach(function() {
    mockery.resetCache();
    mockery.disable();
  });

  it('stores auth details', function() {
    var auth = { auth: 'data' };
    var client = new Client(auth)
    expect(client.auth).to.be(auth);
  });

  describe('#request', function() {
    var client;
    var requestMock;
    var auth = { token: "SOMETOKEN" };

    beforeEach(function() {
      requestMock = sinon.spy();
      mockery.registerMock('request', requestMock);
      client = new (require('../lib/client'))(auth);
    });

    it('proxies to request library', function() {
      var opts = { some: 'options'};
      client.request(opts);
      expect(requestMock.withArgs(opts).calledOnce).to.be.ok();
    });

    it('adds Authorization header', function() {
      var opts = { some: 'options'};
      client.request(opts);
      var authHeader = 'bearer ' + auth.token;

      expect(requestMock.args[0][0].headers['Authorization']).to.be(authHeader);
    });
  });
});
