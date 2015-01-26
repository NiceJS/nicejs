'use strict';
/*global inject:true */
/*global sinon:true */
/*global expect:true */

var scope;
var sessionStub;
var sessionGetStub;
var flashStub;
var flashGetStub;
var rootScope;
var tokenResponse;
var userResponse;
var successResponse;
var infoResponse;
var warningResponse;
var errorResponse;

describe('Root module', function () {

  tokenResponse = 'my_token';
  userResponse = 'my_user';
  successResponse = 'my_success_message';
  infoResponse = 'my_info_message';
  warningResponse = 'my_warning_message';
  errorResponse = 'my_error_message';

  beforeEach(function () {
    module('Root');

    inject(function ($controller, $rootScope) {

      sessionGetStub = sinon.stub();
      sessionGetStub.withArgs('token').returns(tokenResponse);
      sessionGetStub.withArgs('user').returns(userResponse);
      sessionStub = {
        get: sessionGetStub
      };

      flashGetStub = sinon.stub();
      flashGetStub.withArgs('success').returns(successResponse);
      flashGetStub.withArgs('info').returns(infoResponse);
      flashGetStub.withArgs('warning').returns(warningResponse);
      flashGetStub.withArgs('error').returns(errorResponse);
      flashStub = {
        get: flashGetStub
      };

      rootScope = $rootScope;
      scope = $rootScope.$new();

      $controller('RootController', {
        $scope: scope,
        $session: sessionStub,
        $flash: flashStub
      });
    });
  });

  describe('Root Controller', function () {

    it('should get `token` from the session', function () {
      // Arrange

      // Act
      rootScope.$broadcast('$routeChangeSuccess');

      // Assert
      expect(sessionGetStub).to.have.been.calledWithExactly('token');
    });

    it('should set `scope.token` to be the value returned from $session', function () {
      // Arrange

      // Act
      rootScope.$broadcast('$routeChangeSuccess');

      // Assert
      expect(scope.token).to.equal(tokenResponse);
    });

    it('should get `user` from the session', function () {
      // Arrange

      // Act
      rootScope.$broadcast('$routeChangeSuccess');

      // Assert
      expect(sessionGetStub).to.have.been.calledWithExactly('user');
    });

    it('should set `scope.user` to be the value returned from $session', function () {
      // Arrange

      // Act
      rootScope.$broadcast('$routeChangeSuccess');

      // Assert
      expect(scope.user).to.equal(userResponse);
    });

    it('should get `success` from the session', function () {
      // Arrange

      // Act
      rootScope.$broadcast('$routeChangeSuccess');

      // Assert
      expect(flashGetStub).to.have.been.calledWithExactly('success');
    });

    it('should set `scope.flash.success` to be the value returned from $flash', function () {
      // Arrange

      // Act
      rootScope.$broadcast('$routeChangeSuccess');

      // Assert
      expect(scope.flash.success).to.equal(successResponse);
    });

    it('should get `info` from the session', function () {
      // Arrange

      // Act
      rootScope.$broadcast('$routeChangeSuccess');

      // Assert
      expect(flashGetStub).to.have.been.calledWithExactly('info');
    });

    it('should set `scope.flash.info` to be the value returned from $flash', function () {
      // Arrange

      // Act
      rootScope.$broadcast('$routeChangeSuccess');

      // Assert
      expect(scope.flash.info).to.equal(infoResponse);
    });

    it('should get `warning` from the session', function () {
      // Arrange

      // Act
      rootScope.$broadcast('$routeChangeSuccess');

      // Assert
      expect(flashGetStub).to.have.been.calledWithExactly('warning');
    });

    it('should set `scope.flash.warning` to be the value returned from $flash', function () {
      // Arrange

      // Act
      rootScope.$broadcast('$routeChangeSuccess');

      // Assert
      expect(scope.flash.warning).to.equal(warningResponse);
    });

    it('should get `error` from the session', function () {
      // Arrange

      // Act
      rootScope.$broadcast('$routeChangeSuccess');

      // Assert
      expect(flashGetStub).to.have.been.calledWithExactly('error');
    });

    it('should set `scope.flash.error` to be the value returned from $flash', function () {
      // Arrange

      // Act
      rootScope.$broadcast('$routeChangeSuccess');

      // Assert
      expect(scope.flash.error).to.equal(errorResponse);
    });

  });

});