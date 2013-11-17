var request = require('request');

var Bill = require('./resources/bill');
var User = require('./resources/user');
var Payout = require('./resources/payout');
var Merchant = require('./resources/merchant');
var Subscription = require('./resources/subscription');
var PreAuthorization = require('./resources/pre-authorization');

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
  this.bill = new Bill(this, {
    merchantId: merchantId,
    appId: config.appId,
    secret: config.appSecret,
    baseUrl: config.baseUrl
  });
  this.user = new User(this, { merchantId: merchantId });
  this.payout = new Payout(this, { merchantId: merchantId });
  this.merchant = new Merchant(this, { merchantId: merchantId });
  this.subscription = new Subscription(this, { merchantId: merchantId });
  this.preAuthorization = new PreAuthorization(this, { merchantId: merchantId });
}

Client.prototype.request = function(opts, cb) {
  opts = assignAuthHeader(opts, this.config.token);
  opts.headers.Accept = 'application/json';
  opts.uri = this.config.baseUrl + (opts.path || '');
  return request(opts, cb);
};

module.exports = Client;
