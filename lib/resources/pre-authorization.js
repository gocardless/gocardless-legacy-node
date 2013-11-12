var util = require('util');
var _ = require('lodash');

var Resource = require('./resource');
var authorizationBehaviour = require('./shared/authorization-behaviour');

function PreAuthorization() {
  Resource.apply(this, arguments);
}

util.inherits(PreAuthorization, Resource);
_.extend(PreAuthorization.prototype, authorizationBehaviour);

module.exports = function preAuthorizationResourceFactory(client, merchantId) {
  return new PreAuthorization('/pre_authorizations', client, {
    merchantId: merchantId
  });
};
