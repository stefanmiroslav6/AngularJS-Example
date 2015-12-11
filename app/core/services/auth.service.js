/* jshint -W024 */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('authService', serviceFunction);


    // ----- serviceFunction -----
    serviceFunction.$inject = ['$q', '$http', 'localStorageService', 'ENV'];

    /* @ngInject */
    function serviceFunction($q, $http, $ls, ENV) {
        var baseUrl = ENV.baseUrl,
            serviceUrls = ENV.serviceUrls;

        var service = {
            token: token,
            username: username,
            isAuthenticated: isAuthenticated,
            login: login,
            logout: logout
        };

        return service;        

        function isAuthenticated() {
            if ($ls.keys().indexOf('token') === -1) {
                return {
                    success: false,
                    message: 'Please log in'
                };
            }

            var expire = parseInt($ls.get('expire'), 10);
            var now = new Date().getTime() / 1000;

            if (now >= expire) {
                return {
                    success: false,
                    message: 'You are expired!'
                };
            }

            return {
                success: true
            };
        }

        function token() {
            return $ls.get('token');
        }

        function username() {
            return $ls.get('username');
        }

        function login(username, password) {
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: baseUrl + serviceUrls.login,
                data: {
                    username: username,
                    password: password
                },
                headers: {
                    'content-type': 'application/json'
                }
            }).success(function(response) {
                $ls.set('username', response.username);
                $ls.set('token', response.token);
                $ls.set('expire', response.expire);

                deferred.resolve();
            }).error(function() {
                deferred.reject();
            });

            return deferred.promise;
        }

        function logout() {
            $ls.remove('username');
            $ls.remove('token');
            $ls.remove('expire');
        }

    }
})();