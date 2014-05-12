var util = require('util');

var _ = require('lodash');

var constants = require('../constants');

var Resource = require('./resource');
var indexBehaviour = require('./shared/index-behaviour');
var cancelBehaviour = require('./shared/cancel-behaviour');
var connectBehaviour = require('./shared/connect-behaviour');

function Bill(/* client, opts */) {
  this.basePath = '/bills';
  this.paramName = 'bill';
  Resource.apply(this, arguments);
}

util.inherits(Bill, Resource);
_.extend(Bill.prototype, indexBehaviour);
_.extend(Bill.prototype, cancelBehaviour);
_.extend(Bill.prototype, connectBehaviour);

// Create a new bill against an existing pre-authorization. Params must contain
// pre_authorization_id key
Bill.prototype.create = function create(params, cb) {
  return this.post({ json: { bill: params } }, cb);
};

Bill.prototype.retry = function retry(params, cb) {
  var path = constants.API_ROOT + '/bills/' + params.id + '/retry';
  return this.post({ path: path }, cb);
};

// PLEASE NOTE: refunds are disabled on accounts by default.
// If you have processed over 50 successful bills and require access to 
// the refund endpoint, please email help@gocardless.com
Bill.prototype.refund = function refund(params, cb) {
  var path = constants.API_ROOT + '/bills/' + params.id + '/refund';
  return this.post({ path: path }, cb);
};

module.exports = Bill;
