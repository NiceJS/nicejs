'use strict';

/* istanbul ignore next */
angular
    .module('nicejs', [
        'ui.router',
        'pascalprecht.translate',
        'simpleStorage',
        'AuthInterceptor',
        'Root',
        'Users'
    ])
    .config(['$urlRouterProvider', '$stateProvider', '$locationProvider', '$translateProvider', '$httpProvider', 
            function($urlRouterProvider, $stateProvider, $locationProvider, $translateProvider, $httpProvider) {
        $urlRouterProvider.otherwise('/oops');

        $stateProvider.state('home', { url: '/', templateUrl: 'views/root/index' });
        $stateProvider.state('register', { url: '/register', templateUrl: 'views/user/register' });
        $stateProvider.state('login', { url: '/login', templateUrl: 'views/user/login' });
        $stateProvider.state('profile', { url: '/profile', templateUrl: 'views/user/profile' });
        $stateProvider.state('change-password', { url: '/change-password', templateUrl: 'views/user/change-password' });
        $stateProvider.state('error', {url: '/oops', templateUrl: 'views/error'});

        $locationProvider.html5Mode(true);

        $translateProvider.useStaticFilesLoader({
            prefix: 'trans/locale-',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en');

        $httpProvider.interceptors.push('TokenService');
    }]);
