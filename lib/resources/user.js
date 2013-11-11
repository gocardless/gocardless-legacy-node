var util = require('util');
var Resource = require('./resource');

function User() {
  Resource.apply(this, arguments);
}

util.inherits(User, Resource);

User.prototype.index = function index(cb) {
  var path = '/merchants/' + this.opts.merchantId + '/users';
  return this.get({ path: path }, cb);
}

module.exports = function userResourceFactory(client, merchantId) {
  return new User('/users', client, { merchantId: merchantId });
};
