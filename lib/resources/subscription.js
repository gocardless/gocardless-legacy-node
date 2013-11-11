var util = require('util');
var Resource = require('./resource');

function Subscription() {
  Resource.apply(this, arguments);
}

util.inherits(Subscription, Resource);

Subscription.prototype.index = function index(cb) {
  var path = '/merchants/' + this.opts.merchantId + '/subscriptions';
  return this.get({ path: path }, cb);
}

module.exports = function subscriptionResourceFactory(client, merchantId) {
  return new Subscription('/users', client, { merchantId: merchantId });
};
