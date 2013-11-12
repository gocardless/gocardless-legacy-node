var util = require('util');
var _ = require('lodash');

var Resource = require('./resource');
var indexBehaviour = require('./shared/index-behaviour');
var cancelBehaviour = require('./shared/cancel-behaviour');

function Subscription() {
  Resource.apply(this, arguments);
}

util.inherits(Subscription, Resource);
_.extend(Subscription.prototype, indexBehaviour);
_.extend(Subscription.prototype, cancelBehaviour);

module.exports = function subscriptionResourceFactory(client, merchantId) {
  return new Subscription('/subscriptions', client, { merchantId: merchantId });
};
