var path = require('path');

var expect = require('expect.js');
var nock = require('nock');

var GoCardless = require('../../lib/gocardless');

var fixtures = path.resolve('test/fixtures');
var environmentUrls = {
  live: 'https://gocardless.com/',
  sandbox: 'https://sandbox.gocardless.com/'
};

describe('Bill requests', function() {
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

  function itGetsABill(billId) {
    beforeEach(function() {
      nock(environmentUrls[env])
        .matchHeader('Accept', 'application/json')
        .matchHeader('Authorization', 'bearer ' + config.token)
        .get('/api/v1/bills/' + billId)
        .replyWithFile(200, fixtures + '/bill.json');
    });

    it('gets the bill', function(done) {
      gocardless.bill.get({ id: billId }, function(err, resp, body) {
        expect(JSON.parse(body).id).to.be(billId);
        done();
      });
    });
  }

  describe('in live mode', function() {
    beforeEach(function() {
      env = 'live';
    });

    itGetsABill('0ABC123456');
  });

  describe('in sandbox mode', function() {
    beforeEach(function() {
      env = 'live';
    });

    itGetsABill('0ABC123456');
  });
});
