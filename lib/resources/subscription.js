var util = require('util');
var _ = require('lodash');

var Resource = require('./resource');
var authorizationBehaviour = require('./shared/authorization-behaviour');

function Subscription() {
  Resource.apply(this, arguments);
}

util.inherits(Subscription, Resource);
_.extend(Subscription.prototype, authorizationBehaviour);

module.exports = function subscriptionResourceFactory(client, merchantId) {
  return new Subscription('/subscriptions', client, { merchantId: merchantId });
};
