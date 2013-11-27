var path = require('path');

var nock = require('nock');
var expect = require('expect.js');

var gocardlessFactory = require('../../lib/gocardless');
var Signer = require('../../lib/helpers/request-signer');

var fixtures = path.resolve('test/fixtures');
var environmentUrls = {
  live: 'https://gocardless.com',
  sandbox: 'https://sandbox.gocardless.com'
};

describe('Resource requests', function() {
  function testResources(env) {
    var server, gocardless, config;

    beforeEach(function() {
      config = {
        token:'9012IJKL',
        appId: '1234ABCD',
        appSecret: '5678EFGH',
        merchantId:'3456MNOP',
        sandbox: (env === 'sandbox')
      };

      gocardless = gocardlessFactory(config);
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

        gocardless.bill.find(billId, done);
      });

      it('gets index', function(done) {
        server
          .get('/api/v1/merchants/' + config.merchantId + '/bills')
          .replyWithFile(200, fixtures + '/bills.json');

        gocardless.bill.index(done);
      });

      it('gets paginated index', function(done) {
        var query = '?page=2&per_page=10';
        server
          .get('/api/v1/merchants/' + config.merchantId + '/bills' + query)
          .replyWithFile(200, fixtures + '/bills.json');

        gocardless.bill.index({ page: 2, per_page: 10 }, done);
      });

      it('creates a new bill', function(done) {
        var expectedParams = {
          bill: {
            amount: '10.0',
            pre_authorization_id: '123'
          }
        };

        server
          .post('/api/v1/bills', expectedParams)
          .replyWithFile(201, fixtures + '/bill.json');

        gocardless.bill.create({
          amount: '10.0',
          pre_authorization_id: '123'
        }, done);
      });

      it('retries a failed bill', function(done) {
        var billId = '123ABC';
        server
          .post('/api/v1/bills/' + billId + '/retry')
          .replyWithFile(201, fixtures + '/bill.json');

        gocardless.bill.retry({ id: billId }, done);
      });
    });

    describe('User', function() {
      it('gets index', function(done) {
        server
          .get('/api/v1/merchants/' + config.merchantId + '/users')
          .replyWithFile(200, fixtures + '/users.json');

        gocardless.user.index(done);
      });
    });

    describe('Merchant', function() {
      it('gets self', function(done) {
        server
          .get('/api/v1/merchants/' + config.merchantId)
          .replyWithFile(200, fixtures + '/merchant.json');

        gocardless.merchant.getSelf(done);
      });
    });

    describe('Payout', function() {
      it('gets one', function(done) {
        var payoutId = '0ABC123456';
        server
          .get('/api/v1/payouts/' + payoutId)
          .replyWithFile(200, fixtures + '/payout.json');

        gocardless.payout.find(payoutId, done);
      });

      it('gets index', function(done) {
        server
          .get('/api/v1/merchants/' + config.merchantId + '/payouts')
          .replyWithFile(200, fixtures + '/payouts.json');

        gocardless.payout.index(done);
      });

      it('gets paginated index', function(done) {
        var query = '?page=2&per_page=10';
        server
          .get('/api/v1/merchants/' + config.merchantId + '/payouts' + query)
          .replyWithFile(200, fixtures + '/payouts.json');

        gocardless.payout.index({ page: 2, per_page: 10 }, done);
      });
    });

    describe('Subscription', function() {
      it('gets one', function(done) {
        server
          .get('/api/v1/subscriptions/123')
          .replyWithFile(200, fixtures + '/subscription.json');

        gocardless.subscription.find(123, done);
      });

      it('gets index', function(done) {
        server
          .get('/api/v1/merchants/' + config.merchantId + '/subscriptions')
          .replyWithFile(200, fixtures + '/subscriptions.json');

        gocardless.subscription.index(done);
      });

      it('gets paginated index', function(done) {
        var query = '?page=2&per_page=10';
        var id = config.merchantId;
        server
          .get('/api/v1/merchants/' + id + '/subscriptions' + query)
          .replyWithFile(200, fixtures + '/subscriptions.json');

        gocardless.subscription.index({ page: 2, per_page: 10 }, done);
      });

      it('cancels one', function(done) {
        server
          .put('/api/v1/subscriptions/123/cancel')
          .replyWithFile(200, fixtures + '/subscription.json');

        gocardless.subscription.cancel({ id: 123 }, done);
      });
    });

    describe('PreAuthorization', function() {
      it('gets one', function(done) {
        server
          .get('/api/v1/pre_authorizations/123')
          .replyWithFile(200, fixtures + '/pre-authorization.json');

        gocardless.preAuthorization.find(123, done);
      });

      it('gets index', function(done) {
        server
          .get('/api/v1/merchants/' + config.merchantId + '/pre_authorizations')
          .replyWithFile(200, fixtures + '/pre-authorizations.json');

        gocardless.preAuthorization.index(done);
      });

      it('gets paginated index', function(done) {
        var query = '?page=2&per_page=10';
        var id = config.merchantId;
        server
          .get('/api/v1/merchants/' + id + '/pre_authorizations' + query)
          .replyWithFile(200, fixtures + '/pre-authorizations.json');

        gocardless.preAuthorization.index({ page: 2, per_page: 10 }, done);
      });

      it('cancels one', function(done) {
        server
          .put('/api/v1/pre_authorizations/123/cancel')
          .replyWithFile(200, fixtures + '/pre-authorization.json');

        gocardless.preAuthorization.cancel({ id: 123 }, done);
      });
    });

    describe('confiming a resource', function() {
      function confirmResourceOfType(resourceType) {
        var id, params, authHeader;

        beforeEach(function() {
          id = '123ABC';
          params = {
            resource_type: resourceType,
            resource_id: id
          };

          var auth = config.appId + ':' + config.appSecret;
          authHeader = new Buffer(auth).toString('base64');

          server = nock(environmentUrls[env])
                     .matchHeader('Accept', 'application/json');
        });

        describe('with a good signature', function() {
          beforeEach(function() {
            var query = Signer.toQuery(params);
            params.signature = Signer.sign(query, config.appSecret);
          });

          it('confirms the resource', function(done) {
            server
              .matchHeader('Authorization', 'Basic ' + authHeader)
              .post('/api/v1/confirm', {
                resource_id: '123ABC',
                resource_type: resourceType
              }).reply(200);

            gocardless.confirmResource(params, done);
          });
        });

        describe('with a bad signature', function() {
          beforeEach(function() {
            var query = Signer.toQuery({ hacked: 'params' });
            params.signature = Signer.sign(query, config.appSecret);
          });

          it('does not confirm the resource', function(done) {
            server.post('/api/v1/confirm').reply(200);

            gocardless.confirmResource(params, function(err) {
              expect(server.isDone()).to.be(false);
              expect(err).to.be.a(Error);
              done();
            });
          });
        });
      }

      confirmResourceOfType('bill');
      confirmResourceOfType('subscription');
      confirmResourceOfType('pre_authorization');
    });
  }

  describe('in live mode', function() {
    testResources('live');
  });

  describe('in sandbox mode', function() {
    testResources('sandbox');
  });
});
