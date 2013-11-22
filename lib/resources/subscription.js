var util = require('util');
var _ = require('lodash');

var Resource = require('./resource');
var indexBehaviour = require('./shared/index-behaviour');
var cancelBehaviour = require('./shared/cancel-behaviour');
var connectBehaviour = require('./shared/connect-behaviour');

function Subscription() {
  this.basePath = '/subscriptions';
  this.paramName = 'subscription';
  Resource.apply(this, arguments);
}

util.inherits(Subscription, Resource);
_.extend(Subscription.prototype, indexBehaviour);
_.extend(Subscription.prototype, cancelBehaviour);
_.extend(Subscription.prototype, connectBehaviour);

module.exports = Subscription;
