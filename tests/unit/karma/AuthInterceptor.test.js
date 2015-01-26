'use strict';
/*global inject:true */
/*global sinon:true */
/*global expect:true */

describe('AuthInterceptor module', function () {
  var tokenService;
  var mockSession;
  var getStub;
  var mockQ;
  var sandbox;
  var configStub;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    configStub = {};
    mockQ = {};

    module('AuthInterceptor', function ($provide) {
      getStub = sandbox.stub();
      getStub.withArgs('token').returns(null);

      mockSession = {
        get: getStub
      };
      $provide.value('$session', mockSession);
      $provide.value('$q', mockQ);
    });
  });

  beforeEach(function () {
    inject(function (_TokenService_) {
      tokenService = _TokenService_;
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('TokenService', function () {
    it('should not alter config if $session token is not set and config has headers', function () {
      // Arrange
      configStub = {
        headers: {}
      };

      // Act
      var output = tokenService.request(configStub);

      // Assert
      expect(output).to.eql(configStub);
    });

    it('should set authentication header in request if token is present in $session', function () {
      // Arrange
      configStub = {
        headers: {}
      };

      getStub.withArgs('token').returns('asbeefef');

      // Act
      var output = tokenService.request(configStub);

      // Assert
      expect(output.headers.Authorization).to.exist; // jshint ignore:line
    });

    it('should still set authentication header in request if no headers present', function () {
      // Arrange
      configStub = {
      };

      getStub.withArgs('token').returns('asbeefef');

      // Act
      var output = tokenService.request(configStub);

      // Assert
      expect(output.headers.Authorization).to.exist; // jshint ignore:line
    });

    it('should return response passed in if not null', function () {
      // Arrange
      var responseStub = {};

      // Act
      var output = tokenService.response(responseStub);

      // Assert
      expect(output).to.eql(responseStub);
    });

    it('should wait for response if response passed in null', function () {
      // Arrange
      var responseStub = null;
      var expected = {
        other: 'stuffs'
      };

      var whenStub = sinon.stub();
      whenStub.returns(expected);
      mockQ.when = whenStub;


      // Act
      var output = tokenService.response(responseStub);

      // Assert
      expect(output).to.eql(expected);
    });
  });
});
