'use strict';
/*global angular:true */

var users = angular.module('Users', []);

users.controller('RegisterController', function($scope, $location, $route, $session, $flash, UserService) {
  $scope.register = function(user) {
    //console.log(UserService.register({}).then())
    UserService
      .register(user)
        .then(
          function (result) {
            $session.set('token', result.data.token);
            $session.set('user', {username: user.username});
            $flash.set('success', 'register.message.success');
            $location.path('/');
          },
          function (result) {
            $flash.set('error', 'register.message.error.' + result.data.message);
            $route.reload();
          }
        );
  };
});

users.controller('LoginController', function($scope, $location, $route, $session, $flash, UserService) {
  $scope.login = function(user) {
    UserService
      .login(user)
        .then(
          function(result) {
            $session.set('token', result.data.token);
            $session.set('user', {username: user.username});
            $flash.set('success', 'login.message.success');
            $location.path('/');
          },
          function(result){
            $flash.set('error', 'login.message.error.' + result.data.message);
            $route.reload();
          }
        );
  };
});

users.controller('LogoutController', function($scope, $location, $session, $flash, $route) {
  $scope.logout = function() {
    $session.remove('token');
    $session.remove('user');
    $flash.set('info', 'logout.message.success');
    $location.path('/');
    $route.reload();
  };
});

// TODO: this needs to have authentication service on it.
users.controller('ChangePasswordController', function($scope, $location, $session, $flash, $route, UserService) {
  $scope.changePassword = function(changePasswordData) {
    UserService
      .changePassword(changePasswordData)
        .then(
          function(result) {
            $session.set('token', result.data.token);
            $flash.set('info', 'changepassword.message.success');
            $route.reload();
          },
          function(result) {
            $flash.set('error', 'changepassword.message.error.' + result.data.message);
            $route.reload();
          }
        );
  };
});

users.factory('UserService', ['$http', function($http) {
  return {
    register: function(registerData) {
      return $http.post('/api/register', registerData);
    },
    login: function(loginData) {
        return $http.post('/api/login', loginData);
    },
    changePassword: function(changePasswordData) {
        return $http.post('/api/p/change-password', changePasswordData);
    }
  };
}
]);
