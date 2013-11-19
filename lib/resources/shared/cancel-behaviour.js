// Shared behaviour applies to Subscription and PreAuthorization
var constants = require('../../constants');

module.exports = {
  cancel: function cancel(opts, cb) {
    var path = constants.API_ROOT + this.basePath + '/' + opts.id + '/cancel';
    return this.put({ path: path }, cb);
  }
};
