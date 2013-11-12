var path = require('path');

var expect = require('expect.js');
var nock = require('nock');

var GoCardless = require('../../lib/gocardless');

var fixtures = path.resolve('test/fixtures');
var environmentUrls = {
  live: 'https://gocardless.com/',
  sandbox: 'https://sandbox.gocardless.com/'
};

describe('Resource requests', function() {
  function testResources(env) {
    var server, gocardless, config;

    beforeEach(function() {
      config = {
        token:'9012IJKL',
        app_id: '1234ABCD',
        app_secret: '5678EFGH',
        merchant_id:'3456MNOP',
        sandbox: (env === 'sandbox')
      };

      gocardless = GoCardless(config);
      server = nock(environmentUrls[env])
                 .matchHeader('Accept', 'application/json')
                 .matchHeader('Authorization', 'bearer ' + config.token);
    });

    describe('Bill', function() {
      it('gets one', function(done) {
        var billId = '0ABC123456';
        server
          .get('/api/v1/bills/' + billId)
          .replyWithFile(200, fixtures + '/bill.json');

        gocardless.bill.get({ id: billId }, done);
      });
    });

    describe('Merchant', function() {
      it('gets self', function(done) {
        server
          .get('/api/v1/merchants/' + config.merchant_id)
          .replyWithFile(200, fixtures + '/merchant.json');

        gocardless.merchant.getSelf(done);
      });
    });

    describe('User', function() {
      it('gets index', function(done) {
        server
          .get('/api/v1/merchants/' + config.merchant_id + '/users')
          .replyWithFile(200, fixtures + '/users.json');

        gocardless.user.index(done);
      });
    });
  }

  describe('in live mode', function() {
    testResources('live');
  });

  describe('in sandbox mode', function() {
    testResources('sandbox');
  });
});
