'use strict';
/*global angular:true */

angular
    .module('Root', [])
    .controller('RootController', ['$scope', '$session', '$flash', function($scope, $session, $flash) {

        $scope.$on('$stateChangeSuccess', function() {
            $scope.token = $session.get('token');
            $scope.user = $session.get('user');

            $scope.flash = {
                success: $flash.get('success'),
                info: $flash.get('info'),
                warning: $flash.get('warning'),
                error: $flash.get('error')
            };
        });
    }]);
