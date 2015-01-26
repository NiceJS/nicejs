'use strict';
/*global inject:true */
/*global sinon:true */
/*global expect:true */

describe('Users module', function () {
  var sandbox;
  var httpBackend;
  var userService;
  var mockUserService;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    mockUserService = {};

    module('Users');
  });

  beforeEach(function () {
    inject(function (UserService, $httpBackend) {
      httpBackend = $httpBackend;
      userService = UserService;
    });
  });

  describe('Users Service', function () {
    describe('register function', function () {
      it('should return a promise', function () {
        // Arrange
        var user = {
          username: 'dummy',
          password: 'fassaddf'
        };

        // Act
        var promise = userService.register(user);

        var expected = ['$$state', 'success', 'error'];

        // Assert
        expect(Object.keys(promise)).to.eql(expected);
      });

      it('should make an http POST to /api/register', function () {
        // Arrange
        var user = {
          username: 'dummy',
          password: 'fassaddf'
        };

        var expected = 'some response';
        httpBackend.when('POST', '/api/register').respond(expected);

        // Act
        var out = userService.register(user);

        out.then(function (result) {
          expect(result.data).to.equal(expected);
        });

        httpBackend.flush();
      });
    });

    describe('login function', function () {
      it('should return a promise', function () {
        // Arrange
        var user = {
          username: 'dummy',
          password: 'fassaddf'
        };

        // Act
        var promise = userService.login(user);

        var expected = ['$$state', 'success', 'error'];

        // Assert
        expect(Object.keys(promise)).to.eql(expected);
      });

      it('should make an http POST to /api/login', function () {
        // Arrange
        var user = {
          username: 'dummy',
          password: 'fassaddf'
        };

        var expected = 'some response';
        httpBackend.when('POST', '/api/login').respond(expected);

        // Act
        var out = userService.login(user);

        out.then(function (result) {
          expect(result.data).to.equal(expected);
        });

        httpBackend.flush();
      });
    });

    describe('changePassword function', function () {
      it('should return a promise', function () {
        // Arrange
        var user = {
          username: 'dummy',
          password: 'fassaddf'
        };

        // Act
        var promise = userService.changePassword(user);

        var expected = ['$$state', 'success', 'error'];

        // Assert
        expect(Object.keys(promise)).to.eql(expected);
      });

      it('should make an http POST to /api/p/change-password', function () {
        // Arrange
        var user = {
          username: 'dummy',
          password: 'fassaddf'
        };

        var expected = 'some response';
        httpBackend.when('POST', '/api/p/change-password').respond(expected);

        // Act
        var out = userService.changePassword(user);

        out.then(function (result) {
          expect(result.data).to.equal(expected);
        });

        httpBackend.flush();
      });
    });
  });
});
