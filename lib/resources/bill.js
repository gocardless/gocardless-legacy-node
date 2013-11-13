var util = require('util');

var _ = require('lodash');

var Resource = require('./resource');
var indexBehaviour = require('./shared/index-behaviour');

function Bill() {
  Resource.apply(this, arguments);
}

util.inherits(Bill, Resource);
_.extend(Bill.prototype, indexBehaviour);

Bill.prototype.create = function create(params, cb) {
  return this.post({ json: { bill: params } }, cb);
};

Bill.prototype.retry = function retry(params, cb) {
  var path = '/api/v1/bills/' + params.id + '/retry';
  return this.post({ path: path }, cb);
};

module.exports = function billResourceFactory(client, merchantId) {
  return new Bill('/bills', client, { merchantId: merchantId });
};
