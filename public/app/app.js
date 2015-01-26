'use strict';
/*global angular:true */

angular
    .module('nicejs', [
        'ngRoute',
        'pascalprecht.translate',
        'simpleStorage',
        'AuthInterceptor',
        'appRoutes',
        'Root',
        'Users'
    ]);