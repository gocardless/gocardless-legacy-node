var request = require('request');

function assignAuthHeader(opts, token) {
  var authHeader = 'bearer ' + token;
  opts.headers = (opts.headers || {});
  opts.headers['Authorization'] = (opts.headers['Authorization'] || authHeader);
  return opts;
}

function Client(config) {
  if (!config || config.baseUrl == null) {
    throw new Error('ArgumentError: config.baseUrl is required');
  }

  this.config = config;

  var merchantId = config.merchant_id;
  this.bill = require('./resources/bill')(this, merchantId);
  this.user = require('./resources/user')(this, merchantId);
  this.payout = require('./resources/payout')(this);
  this.merchant = require('./resources/merchant')(this, merchantId);
  this.subscription = require('./resources/subscription')(this, merchantId);
  this.preAuthorization = require('./resources/pre-authorization')(this, merchantId);
};

Client.prototype.request = function(opts, cb) {
  opts = assignAuthHeader(opts, this.config.token);
  opts.headers['Accept'] = 'application/json';
  opts.uri = this.config.baseUrl + (opts.path || '');
  return request(opts, cb);
};

module.exports = Client;
