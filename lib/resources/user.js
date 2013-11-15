var util = require('util');

var _ = require('lodash');

var Resource = require('./resource');
var indexBehaviour = require('./shared/index-behaviour');

function User() {
  this.basePath = '/users';
  Resource.apply(this, arguments);
}

util.inherits(User, Resource);
_.extend(User.prototype, indexBehaviour);

module.exports = User;
