var path = require('path');

var expect = require('expect.js');
var nock = require('nock');

var GoCardless = require('../../lib/gocardless');

var fixtures = path.resolve('test/fixtures');
var environmentUrls = {
  live: 'https://gocardless.com/',
  sandbox: 'https://sandbox.gocardless.com/'
};

describe('Merchant requests', function() {
  var gocardless, config, env;

  beforeEach(function() {
    config = {
      token:'9012IJKL',
      app_id: '1234ABCD',
      app_secret: '5678EFGH',
      merchant_id:'3456MNOP',
      sandbox: (env === 'sandbox')
    };

    afterEach(function() {
      env = void 0;
    });

    gocardless = GoCardless(config);
  });

  function itGetsSelf() {
    beforeEach(function() {
      nock(environmentUrls[env])
        .matchHeader('Accept', 'application/json')
        .matchHeader('Authorization', 'bearer ' + config.token)
        .get('/api/v1/merchants/' + config.merchant_id)
        .replyWithFile(200, fixtures + '/merchant.json');
    });

    it('gets the current merchant', function(done) {
      gocardless.merchant.getSelf(function(err, resp, body) {
        expect(JSON.parse(body).id).to.be(config.merchant_id);
        done();
      });
    });
  }

  describe('in live mode', function() {
    beforeEach(function() {
      env = 'live';
    });

    itGetsSelf();
  });

  describe('in sandbox mode', function() {
    beforeEach(function() {
      env = 'live';
    });

    itGetsSelf();
  });
});
