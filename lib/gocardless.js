var _ = require('lodash');
var Client = require('./client');

var CONFIG_KEYS = ['app_id', 'app_secret', 'token', 'merchant_id'];
var API_BASE = 'https://gocardless.com/api/v1';
var SANDBOX_API_BASE = 'https://sandbox.gocardless.com/api/v1';

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
  opts.baseUrl = opts.sandbox ? SANDBOX_API_BASE : API_BASE;
  return new Client(opts);
};
