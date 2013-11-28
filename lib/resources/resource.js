var _ = require('lodash');

var constants = require('../constants');

function toString(val) {
  return val.toString();
}

function buildPath() {
  var args = _.compact([].slice.call(arguments, 0)).map(toString);

  return args.map(function(arg) {
    if (arg[0] !== '/') arg = '/' + arg;
    if (arg[arg.length - 1] === '/') arg = arg.substr(0, arg.length);
    return arg;
  }).join('');
}

function Resource(client, opts) {
  this.client = client;
  this.opts = opts;
}

Resource.prototype.get = function get(opts, cb) {
  if(_.isFunction(opts)) {
    cb = opts;
    opts = {};
  }

  opts = opts || {};
  opts.path = opts.path || buildPath(constants.API_ROOT, this.basePath, opts.id);
  opts.method = 'GET';

  return this.client.request(opts, cb);
};

Resource.prototype.put = function put(opts, cb) {
  if(_.isFunction(opts)) {
    cb = opts;
    opts = {};
  }

  opts = opts || {};
  opts.path = opts.path || buildPath(constants.API_ROOT, this.basePath, opts.id);
  opts.method = 'PUT';

  return this.client.request(opts, cb);
};

Resource.prototype.post = function post(opts, cb) {
  if(_.isFunction(opts)) {
    cb = opts;
    opts = {};
  }

  opts = opts || {};
  opts.path = opts.path || buildPath(constants.API_ROOT, this.basePath, opts.id);
  opts.method = 'POST';

  return this.client.request(opts, cb);
};

Resource.prototype.del = function del(opts, cb) {
  if(_.isFunction(opts)) {
    cb = opts;
    opts = {};
  }

  opts = opts || {};
  opts.path = opts.path || buildPath(constants.API_ROOT, this.basePath, opts.id);
  opts.method = 'DELETE';

  return this.client.request(opts, cb);
};

Resource.prototype.find = function(id, cb) {
  return this.get({id: id}, cb);
};

module.exports = Resource;
