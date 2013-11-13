var _ = require('lodash');
var Client = require('./client');

var CONFIG_KEYS = ['app_id', 'app_secret', 'token', 'merchant_id'];
var URL_BASE = 'https://gocardless.com';
var SANDBOX_URL_BASE = 'https://sandbox.gocardless.com';

function validateConfig(opts) {
  var missing = _.compact(CONFIG_KEYS.map(function(key) {
    if (opts[key] == null) return key;
  }));

  if (!_.isEmpty(missing)) {
    throw new Error('Required option(s) ' + missing.join(', ') + ' are missing');
  }
}

module.exports = function configure(opts) {
  validateConfig(opts);
  opts.baseUrl = opts.sandbox ? SANDBOX_URL_BASE : URL_BASE;
  return new Client(opts);
};
