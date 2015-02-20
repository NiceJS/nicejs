'use strict';

angular
  .module('AuthInterceptor', [])
    .factory('TokenService',  ['$session', '$q', function ($session, $q) {
      return {
        request: function (config) {
          var token;

          token = $session.get('token');
          config.headers = config.headers || {};

          if (token) {
            config.headers.Authorization = 'Bearer ' + token;
          }

          return config;
        },
        response: function (response) {
          // if (response.status === 401) {
          // TODO: user not authenticated
          // }

          return response || $q.when(response);
        }
      };
    }
  ]);
