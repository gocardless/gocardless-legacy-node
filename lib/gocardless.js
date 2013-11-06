var _ = require('lodash');
var Client = require('./client');

var CONFIG_KEYS = ['app_id', 'app_secret', 'token', 'merchant_id'];

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
  return new Client(opts);
};
