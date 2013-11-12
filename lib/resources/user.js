var util = require('util');

var _ = require('lodash');

var Resource = require('./resource');
var indexBehaviour = require('./shared/index-behaviour');

function User() {
  Resource.apply(this, arguments);
}

util.inherits(User, Resource);
_.extend(User.prototype, indexBehaviour);

module.exports = function userResourceFactory(client, merchantId) {
  return new User('/users', client, { merchantId: merchantId });
};
