var util = require('util');
var _ = require('lodash');

var Resource = require('./resource');
var indexBehaviour = require('./shared/index-behaviour');
var cancelBehaviour = require('./shared/cancel-behaviour');

function PreAuthorization() {
  Resource.apply(this, arguments);
}

util.inherits(PreAuthorization, Resource);
_.extend(PreAuthorization.prototype, indexBehaviour);
_.extend(PreAuthorization.prototype, cancelBehaviour);

module.exports = function preAuthorizationResourceFactory(client, merchantId) {
  return new PreAuthorization('/pre_authorizations', client, {
    merchantId: merchantId
  });
};
