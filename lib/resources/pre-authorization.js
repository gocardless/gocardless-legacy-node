var util = require('util');
var _ = require('lodash');

var Resource = require('./resource');
var indexBehaviour = require('./shared/index-behaviour');
var cancelBehaviour = require('./shared/cancel-behaviour');

function PreAuthorization() {
  this.basePath = '/pre_authorizations';
  Resource.apply(this, arguments);
}

util.inherits(PreAuthorization, Resource);
_.extend(PreAuthorization.prototype, indexBehaviour);
_.extend(PreAuthorization.prototype, cancelBehaviour);

module.exports = PreAuthorization;
