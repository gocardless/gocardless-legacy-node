var _ = require('lodash');
var request = require('request');

var constants = require('./constants');

var Bill = require('./resources/bill');
var User = require('./resources/user');
var Payout = require('./resources/payout');
var Merchant = require('./resources/merchant');
var Subscription = require('./resources/subscription');
var PreAuthorization = require('./resources/pre-authorization');
var Signer = require('./helpers/request-signer');

function assignAuthHeader(opts, token) {
  var authHeader = 'bearer ' + token;
  opts.headers = (opts.headers || {});
  opts.headers.Authorization = (opts.headers.Authorization || authHeader);
  return opts;
}

function Client(config) {
  if (!config || config.baseUrl == null) {
    throw new Error('ArgumentError: config.baseUrl is required');
  }

  this.config = config;

  var merchantId = config.merchantId;
  this.user = new User(this, { merchantId: merchantId });
  this.payout = new Payout(this, { merchantId: merchantId });
  this.merchant = new Merchant(this, { merchantId: merchantId });

  var connectConfig = {
    merchantId: merchantId,
    appId: config.appId,
    secret: config.appSecret,
    baseUrl: config.baseUrl
  };
  this.bill = new Bill(this, connectConfig);
  this.subscription = new Subscription(this, connectConfig);
  this.preAuthorization = new PreAuthorization(this, connectConfig);
}

Client.prototype.request = function(opts, cb) {
  if (!opts.auth) opts = assignAuthHeader(opts, this.config.token);
  opts.headers = (opts.headers || {});
  opts.headers.Accept = 'application/json';
  opts.headers['User-Agent'] = 'gocardless-node/v' + constants.VERSION;
  opts.uri = this.config.baseUrl + (opts.path || '');
  return request(opts, cb);
};

Client.prototype.confirmResource = function confirmResource(params, cb) {
  if (!Signer.verify(params, this.config.appSecret)) {
    var err = 'Signature does not match params.' +
              'This request has been tampered with.';
    return _.isFunction(cb) && cb(new Error(err));
  }

  var opts = {
    path: constants.API_ROOT + '/confirm',
    method: 'POST',
    json: {
      resource_type: params.resource_type,
      resource_id: params.resource_id
    },
    auth: {
      user: this.config.appId,
      pass: this.config.appSecret
    }
  };
  return this.request(opts, cb);
};

Client.prototype.webhookValid = function webhookValid(params) {
  return Signer.verify(params.payload, this.config.appSecret);
};

module.exports = Client;
