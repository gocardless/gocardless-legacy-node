var sinon = require('sinon');
var expect = require('expect.js');
var mockery = require('mockery');

expect = require('sinon-expect').enhance(expect, sinon, 'was');

var Client = require('../../lib/client');
var Signer = require('../../lib/helpers/request-signer');
var constants = require('../../lib/constants');

describe('Client', function() {
  var config;

  beforeEach(function() {
    config = {
      appId: 'ABC123',
      appSecret: 'SECRET',
      token: 'DATA',
      merchantId: '123ABC',
      baseUrl: 'http://example.com/api'
    };

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
      expect(client[propName].opts.merchantId).to.be(config.merchantId);
    });
  }

  itRegistersAResource('user');
  itRegistersAResource('payout');
  itRegistersAResource('merchant');

  describe('bill', function() {
    itRegistersAResource('bill');

    it('initializes the bill resource with connect config', function() {
      var client = new Client(config);
      expect(client.bill.opts.appId).to.be(config.appId);
      expect(client.bill.opts.secret).to.be(config.appSecret);
      expect(client.bill.opts.baseUrl).to.be(config.baseUrl);
    });
  });

  describe('subscription', function() {
    itRegistersAResource('subscription');

    it('initializes the subscription resource with connect config', function() {
      var client = new Client(config);
      expect(client.subscription.opts.appId).to.be(config.appId);
      expect(client.subscription.opts.secret).to.be(config.appSecret);
      expect(client.subscription.opts.baseUrl).to.be(config.baseUrl);
    });
  });

  describe('preAuthorization', function() {
    itRegistersAResource('preAuthorization', 'pre-authorization');

    it('initializes the preAuthorization resource with connect config', function() {
      var client = new Client(config);
      expect(client.preAuthorization.opts.appId).to.be(config.appId);
      expect(client.preAuthorization.opts.secret).to.be(config.appSecret);
      expect(client.preAuthorization.opts.baseUrl).to.be(config.baseUrl);
    });
  });

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

    it('adds User-Agent header', function() {
      var opts = { some: 'options'};
      client.request(opts);

      expect(requestMock.args[0][0].headers['User-Agent'])
        .to.be('gocardless-node/v' + constants.VERSION);
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

  describe('#confirmResource', function() {
    var client;
    var requestMock;
    var params;

    beforeEach(function() {
      requestMock = sinon.spy();
      mockery.registerMock('request', requestMock);
      client = new (require('../../lib/client'))(config);
      params = { resource_id: 123, resource_type: 'bill' };
    });

    describe('given a bad signature', function() {
      beforeEach(function() {
        params.signature = Signer.sign(Signer.toQuery({a:1}), config.appSecret);
      });

      it('does not make the confirm request', function() {
        client.confirmResource(params);
        expect(requestMock).was.notCalled();
      });

      it('calls the callback with an error', function() {
        var cb = sinon.spy();
        client.confirmResource(params, cb);
        expect(cb.args[0][0]).to.be.a(Error);
      });
    });

    describe('given a good signature', function() {
      beforeEach(function() {
        params.signature = Signer.sign(Signer.toQuery(params), config.appSecret);
      });

      it('posts to the correct url', function() {
        var expectedUri = config.baseUrl + '/api/v1/confirm';
        client.confirmResource(params);
        expect(requestMock.args[0][0].method).to.be('POST');
        expect(requestMock.args[0][0].uri).to.be(expectedUri);
      });

      it('passes resource_type and resource_id params as JSON', function() {
        client.confirmResource(params);
        expect(requestMock.args[0][0].json).to.eql({
          resource_id: params.resource_id,
          resource_type: params.resource_type
        });
      });

      it('adds Accept header', function() {
        client.confirmResource(params);
        expect(requestMock.args[0][0].headers.Accept).to.be('application/json');
      });

      it('adds basic auth details', function() {
        client.confirmResource(params);
        expect(requestMock.args[0][0].auth).to.eql({
          user: config.appId,
          pass: config.appSecret
        });
      });

      it('passes a callback', function() {
        function cb() {}
        client.confirmResource(params, cb);
        expect(requestMock.args[0][1]).to.be(cb);
      });
    });
  });

  describe('#webhookValid', function() {
    var client;

    beforeEach(function() {
      client = new Client(config);
    });

    it('delegates to Signer.verify with appSecret', function() {
      sinon.spy(Signer, 'verify');
      var params = {
        payload: { some: 'data' }
      };
      client.webhookValid(params);
      expect(Signer.verify).was.calledWith(params.payload, config.appSecret);
    });
  });
});
