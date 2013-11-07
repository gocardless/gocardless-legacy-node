var Resource = require('./resource');

module.exports = function preAuthorizationResourceFactory(client) {
  return new Resource('/pre_authorizations', client);
};
