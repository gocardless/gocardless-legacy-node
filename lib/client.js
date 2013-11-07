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

Client.prototype.request = function(opts) {
  opts = assignAuthHeader(opts, this.config.token);
  return request(opts);
};

Client.prototype.get = function(opts) {
  opts.method = 'GET';
  return this.request(opts);
};

Client.prototype.put = function(opts) {
  opts.method = 'PUT';
  return this.request(opts);
};

Client.prototype.post = function(opts) {
  opts.method = 'POST';
  return this.request(opts);
};

Client.prototype.delete = function(opts) {
  opts.method = 'DELETE';
  return this.request(opts);
};

module.exports = Client;
