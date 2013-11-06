var request = require('request');

function Client(auth) {
  this.auth = auth;
};

Client.prototype.request = function(opts) {
  var authHeader = 'bearer ' + this.auth.token;
  opts.headers = (opts.headers || {});
  opts.headers['Authorization'] = (opts.headers['Authorization'] || authHeader);

  return request(opts);
};

module.exports = Client;
