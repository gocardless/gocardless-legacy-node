var path = require('path');
var _ = require('lodash');
var request = require('request');

var apiBase = '/api/v1';

function toString(val) {
  return val.toString();
}

function buildPath() {
  arguments = _.compact([].slice.call(arguments, 0)).map(toString);
  return path.join.apply(null, arguments);
}

function Resource(basePath, client, opts) {
  this.basePath = basePath;
  this.client = client;
  this.opts = opts;
}

Resource.prototype.get = function get(opts, cb) {
  if(_.isFunction(opts)) {
    cb = opts;
    opts = {};
  }

  opts = opts || {};
  opts.path = opts.path || buildPath(apiBase, this.basePath, opts.id);
  opts.method = 'GET';

  return this.client.request(opts, cb);
};

Resource.prototype.put = function put(opts, cb) {
  if(_.isFunction(opts)) {
    cb = opts;
    opts = {};
  }

  opts = opts || {};
  opts.path = opts.path || buildPath(apiBase, this.basePath, opts.id);
  opts.method = 'PUT';

  return this.client.request(opts, cb);
};

Resource.prototype.post = function post(opts, cb) {
  if(_.isFunction(opts)) {
    cb = opts;
    opts = {};
  }

  opts = opts || {};
  opts.path = opts.path || buildPath(apiBase, this.basePath, opts.id);
  opts.method = 'POST';

  return this.client.request(opts, cb);
};

Resource.prototype.del = function del(opts, cb) {
  if(_.isFunction(opts)) {
    cb = opts;
    opts = {};
  }

  opts = opts || {};
  opts.path = opts.path || buildPath(apiBase, this.basePath, opts.id);
  opts.method = 'DELETE';

  return this.client.request(opts, cb);
};

module.exports = Resource;
