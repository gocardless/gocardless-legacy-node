var url = require('url');
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

  this.bill = require('./resources/bill')(this);
  this.payout = require('./resources/payout')(this);
  this.preAuthorization = require('./resources/pre-authorization')(this);
  this.subscription = require('./resources/subscription')(this);
  this.user = require('./resources/user')(this);
};

Client.prototype.request = function(opts, cb) {
  opts = assignAuthHeader(opts, this.config.token);
  opts.headers['Accept'] = 'application/json';
  opts.uri = url.resolve(this.config.baseUrl, (opts.path || ''));
  return request(opts, cb);
};

module.exports = Client;
