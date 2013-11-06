var _ = require('lodash');
var Client = require('./client');
var client;
var configKeys = ['app_id', 'app_secret', 'token', 'merchant_id'];

function validateConfig(opts) {
  var missing = _.compact(configKeys.map(function(key) {
    if (opts[key] == null) return key;
  }));

  if (!_.isEmpty(missing)) {
    throw new Error('Required option(s) ' + missing.join(', ') + ' are missing');
  }
}

module.exports = function configure(opts) {
  validateConfig(opts);
  client = new Client(opts);
  return client;
};
