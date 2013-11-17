var util = require('util');
var _ = require('lodash');

var Resource = require('./resource');
var indexBehaviour = require('./shared/index-behaviour');
var cancelBehaviour = require('./shared/cancel-behaviour');
var connectBehaviour = require('./shared/connect-behaviour');

function PreAuthorization() {
  this.basePath = '/pre_authorizations';
  this.paramName = 'pre_authorization';
  Resource.apply(this, arguments);
}

util.inherits(PreAuthorization, Resource);
_.extend(PreAuthorization.prototype, indexBehaviour);
_.extend(PreAuthorization.prototype, cancelBehaviour);
_.extend(PreAuthorization.prototype, connectBehaviour);

module.exports = PreAuthorization;
