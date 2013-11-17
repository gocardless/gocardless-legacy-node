var expect = require('expect.js');

var cancelBehaviour = require('./shared/cancel-behaviour-test');
var indexBehaviour = require('./shared/index-behaviour-test');
var connectBehaviour = require('./shared/connect-behaviour-test');

var PreAuthorization = require('../../../lib/resources/pre-authorization');
var Resource = require('../../../lib/resources/resource');

describe('PreAuthorization resource', function() {
  it('is a Resource', function() {
    expect(new PreAuthorization()).to.be.a(Resource);
  });

  indexBehaviour(PreAuthorization);
  cancelBehaviour(PreAuthorization);
  connectBehaviour('preAuthorization', 'pre-authorization');
});
