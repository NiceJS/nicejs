'use strict';
/*global inject:true */
/*global sinon:true */
/*global expect:true */

var sandbox;
var scope;
var pathStub;
var sessionStub;
var flashStub;
var routeStub;
var reloadStub;
var mockUserService;
var result;
var rootScope;

describe('Users module', function () {
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    mockUserService = {};
    result = {
      data: {
        token: 'my_token',
        message: 'my_fail_message'
      }
    };

    module('Users');
  });

  beforeEach(function () {
    inject(function ($controller, $rootScope, $q, _UserService_) {
      rootScope = $rootScope;
      mockUserService = _UserService_;

      mockUserService.register = function() {
        var defer = $q.defer();

        defer.resolve(result);

        return defer.promise;

      };

      sessionStub = {
        set: sinon.stub(),
        remove: sinon.stub()
      };

      flashStub = {
        set: sinon.stub()
      };

      pathStub = sinon.stub();
      var locationStub = {
        path: pathStub
      };

      reloadStub = sinon.stub();
      routeStub = {
        reload: reloadStub
      };

      scope = $rootScope.$new();

      $controller('RegisterController', {
        $scope: scope,
        $location: locationStub,
        $session: sessionStub,
        $flash: flashStub,
        $route: routeStub,
        UserService: mockUserService
      });

      $controller('LoginController', {
        $scope: scope,
        $location: locationStub,
        $session: sessionStub,
        $flash: flashStub,
        $route: routeStub,
        UserService: mockUserService
      });

      $controller('LogoutController', {
        $scope: scope,
        $location: locationStub,
        $session: sessionStub,
        $flash: flashStub,
        $route: routeStub
      });

      $controller('ChangePasswordController', {
        $scope: scope,
        $session: sessionStub,
        $flash: flashStub,
        $route: routeStub,
        UserService: mockUserService
      });
    });
  });

  describe('Register Controller', function () {
    describe('on success', function () {

      var user;
      
      beforeEach(function () {
        inject(function ($q) {
          mockUserService.register = function() {
            var defer = $q.defer();

            defer.resolve(result);

            return defer.promise;
          };

          user = {
            username: 'karma@karma',
            password: 'qwerty'
          };
        });

      });

      it('should set token in session', function () {
        // Arrange

        // Act
        scope.register(user);
        rootScope.$apply();

        // Assert
        expect(sessionStub.set).to.have.been.calledWithExactly('token', result.data.token);
      });

      it('should set username in user object in session', function() {
        // Arrange

        // Act
        scope.register(user);
        rootScope.$apply();

        // Assert
        expect(sessionStub.set).to.have.been.calledWithExactly('user', {username: user.username});
      });

      it('should set successful registration message', function () {
        // Arrange

        // Act
        scope.register(user);
        rootScope.$apply();

        // Assert
        expect(flashStub.set).to.have.been.calledWithExactly('success', 'register.message.success');
      });

      it('should redirect to home page', function () {
        // Arrange

        // Act
        scope.register(user);
        rootScope.$apply();

        // Assert
        expect(pathStub).to.have.been.calledWithExactly('/');
      });
    });

    describe('on error', function () {

      var user;

      beforeEach(function () {
        inject(function ($q) {
          mockUserService.register = function() {
            var defer = $q.defer();

            defer.reject(result);

            return defer.promise;
          };

          user = {
            username: 'karma@karma',
            password: 'qwerty'
          };
        });

      });

      it('should set error flash message', function () {
        // Arrange

        // Act
        scope.register(user);
        rootScope.$apply();

        // Assert
        expect(flashStub.set).to.have.been.calledWithExactly('error', 'register.message.error.' + result.data.message);
      });

      it('should reload the current route', function () {
        // Arrange

        // Act
        scope.register(user);
        rootScope.$apply();

        // Assert
        expect(reloadStub).to.have.been.calledOnce; // jshint ignore:line
      });
    });
  });

  describe('Login Controller', function() {
    describe('on success', function() {

      var user;
      
      beforeEach(function () {
        inject(function ($q) {
          mockUserService.login = function() {
            var defer = $q.defer();

            defer.resolve(result);

            return defer.promise;
          };

          user = {
            username: 'karma@karma',
            password: 'qwerty'
          };
        });

      });

      it('should set a token in the session', function() {
        // Arrange

        // Act
        scope.login(user);
        rootScope.$apply();

        // Assert
        expect(sessionStub.set).to.have.been.calledWithExactly('token', result.data.token);

      });

      it('should set username in user object within the session', function() {
        // Arrange

        // Act
        scope.login(user);
        rootScope.$apply();

        // Assert
        expect(sessionStub.set).to.have.been.calledWithExactly('user', {username: user.username});
      });

      it('should set a flash message to indicate success', function() {
        // Arrange

        // Act
        scope.login(user);
        rootScope.$apply();

        // Assert
        expect(flashStub.set).to.have.been.calledWithExactly('success', 'login.message.success');
      });

      it('should redirect to home page', function () {
        // Arrange

        // Act
        scope.login(user);
        rootScope.$apply();

        // Assert
        expect(pathStub).to.have.been.calledWithExactly('/');
      });
      
    });

    describe('on error', function () {

      var user;

      beforeEach(function () {
        inject(function ($q) {
          mockUserService.login = function() {
            var defer = $q.defer();

            defer.reject(result);

            return defer.promise;
          };

          user = {
            username: 'karma@karma',
            password: 'qwerty'
          };
        });

      });

      it('should set error flash message', function () {
        // Arrange

        // Act
        scope.login(user);
        rootScope.$apply();

        // Assert
        expect(flashStub.set).to.have.been.calledWithExactly('error', 'login.message.error.' + result.data.message);

      });

      it('should reload the current route', function () {
        // Arrange

        // Act
        scope.login(user);
        rootScope.$apply();

        // Assert
        expect(reloadStub).to.have.been.calledOnce; // jshint ignore:line
      });
    });
  });

  describe('Logout Controller', function() {
    describe('on success', function() {
      
      it('should remove a token from the session', function() {
        // Arrange

        // Act
        scope.logout();
        rootScope.$apply();

        // Assert
        expect(sessionStub.remove).to.have.been.calledWithExactly('token');

      });

      it('should remove user from the session', function() {
        // Arrange

        // Act
        scope.logout();
        rootScope.$apply();

        // Assert
        expect(sessionStub.remove).to.have.been.calledWithExactly('user');
      });

      it('should set a flash message to indicate success', function() {
        // Arrange

        // Act
        scope.logout();
        rootScope.$apply();

        // Assert
        expect(flashStub.set).to.have.been.calledWithExactly('info', 'logout.message.success');
      });

      it('should redirect to home page', function () {
        // Arrange

        // Act
        scope.logout();
        rootScope.$apply();

        // Assert
        expect(pathStub).to.have.been.calledWithExactly('/');
      });

      it('should reload the current route', function () {
        // Arrange

        // Act
        scope.logout();
        rootScope.$apply();

        // Assert
        expect(reloadStub).to.have.been.calledOnce; // jshint ignore:line
      });
      
    });

  });

  describe('Change Password Controller', function() {
    describe('on success', function() {

      var user;
      
      beforeEach(function () {
        inject(function ($q) {
          mockUserService.changePassword = function() {
            var defer = $q.defer();

            defer.resolve(result);

            return defer.promise;
          };

          user = {
            username: 'karma@karma',
            password: 'qwerty'
          };
        });

      });

      it('should set a token in the session', function() {

        // Arrange

        // Act
        scope.changePassword(user);
        rootScope.$apply();

        // Assert
        expect(sessionStub.set).to.have.been.calledWithExactly('token', result.data.token);

      });

      it('should set a flash message to indicate success', function() {
        // Arrange

        // Act
        scope.changePassword(user);
        rootScope.$apply();

        // Assert
        expect(flashStub.set).to.have.been.calledWithExactly('info', 'changepassword.message.success');
      });

      it('should reload the current route', function () {
        // Arrange

        // Act
        scope.changePassword(user);
        rootScope.$apply();

        // Assert
        expect(reloadStub).to.have.been.calledOnce; // jshint ignore:line
      });
      
    });

    describe('on error', function () {

      var user;

      beforeEach(function () {
        inject(function ($q) {
          mockUserService.changePassword = function() {
            var defer = $q.defer();

            defer.reject(result);

            return defer.promise;
          };

          user = {
            username: 'karma@karma',
            password: 'qwerty'
          };
        });

      });

      it('should set error flash message', function () {
        // Arrange

        // Act
        scope.changePassword(user);
        rootScope.$apply();

        // Assert
        expect(flashStub.set).to.have.been.calledWithExactly('error', 'changepassword.message.error.' + result.data.message);

      });

      it('should reload the current route', function () {
        // Arrange

        // Act
        scope.changePassword(user);
        rootScope.$apply();

        // Assert
        expect(reloadStub).to.have.been.calledOnce; // jshint ignore:line
      });
    });
  });

});
