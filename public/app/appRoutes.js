'use strict';
/*global angular:true */

angular
    .module('appRoutes', [])
    .config(['$routeProvider', '$locationProvider', '$translateProvider', '$httpProvider', function($routeProvider, $locationProvider, $translateProvider, $httpProvider) {

        $routeProvider
            .when('/', {
                templateUrl: 'root/index'
            })
            .when('/login', {
                templateUrl: 'user/login'
            })
            .when('/register', {
                templateUrl: 'user/register'
            })
            .when('/profile', {
                templateUrl: 'user/profile'
            })
            .when('/change-password', {
                templateUrl: 'user/change-password'
            })
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(false);

        $translateProvider.useStaticFilesLoader({
            prefix: 'trans/locale-',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en');

        $httpProvider.interceptors.push('TokenService');

    }]);
