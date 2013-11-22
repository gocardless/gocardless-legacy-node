var crypto = require('crypto');
var _ = require('lodash');

function encode(str) {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A');
}

function concat(array) {
  return Array.prototype.concat.apply([], array);
}

function toQuery(params, ns) {
  // Recurse if params is an array
  if (_.isArray(params)) {
    return concat(params.map(function(v) {
      return toQuery(v, ns + '[]');
    }));
  }

  if (_.isObject(params)) {
    var pairs = concat(Object.keys(params).map(function(key) {
      return toQuery(params[key], (ns ? ns + '[' + key + ']' : key));
    }));

    if (ns) return pairs;

    return pairs.sort(function(a, b) {
      return a.join('\0') < b.join('\0') ? -1 : (a === b ? 0 : 1);
    }).map(function(pair) {
      return pair.join('=');
    }).join('&');
  }

  return [[encode(ns), encode(params)]];
}

function sign(query, secret) {
  return crypto.createHmac('sha256', secret).update(query).digest('hex');
}

function verify(params, secret) {
  params = _.cloneDeep(params);
  var signature = params.signature;
  delete params.signature;
  var testSignature = sign(toQuery(params), secret);
  return testSignature === signature;
}

module.exports = {
  toQuery: toQuery,
  sign: sign,
  verify: verify
};
