var util = require('util');

var _ = require('lodash');

var Resource = require('./resource');
var indexBehaviour = require('./shared/index-behaviour');

function Payout() {
  this.basePath = '/payouts';
  Resource.apply(this, arguments);
}

util.inherits(Payout, Resource);
_.extend(Payout.prototype, indexBehaviour);

module.exports = Payout;
