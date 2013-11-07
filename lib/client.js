var request = require('request');

function Client(auth) {
  this.auth = auth;

  this.bill = require('./resources/bill')(this);
  this.payout = require('./resources/payout')(this);
  this.preAuthorization = require('./resources/pre-authorization')(this);
  this.subscription = require('./resources/subscription')(this);
  this.user = require('./resources/user')(this);
};

Client.prototype.request = function(opts) {
  var authHeader = 'bearer ' + this.auth.token;
  opts.headers = (opts.headers || {});
  opts.headers['Authorization'] = (opts.headers['Authorization'] || authHeader);

  return request(opts);
};

module.exports = Client;
