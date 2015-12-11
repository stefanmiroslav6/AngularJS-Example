(function () {
    'use strict';

    var core = angular.module('app.core');

    // Application configuration values
    var config = {
        appErrorPrefix: '[Aries UI Error] ',
        appTitle: 'Aries UI'
    };

    core.value('config', config);

    // Configure the app
    core.config(configFunction);

    configFunction.$inject =
        ['$compileProvider', '$logProvider', 'exceptionHandlerProvider', 'localStorageServiceProvider', '$httpProvider'];

    /* @ngInject */
    function configFunction(
        $compileProvider, $logProvider, exceptionHandlerProvider, localStorageServiceProvider, $httpProvider) {

        // During development, you may want to set debugInfoEnabled to true. This is required for tools like
        // Protractor, Batarang and ng-inspector to work correctly. However do not check in this change.
        // This flag must be set to false in production for a significant performance boost.
        $compileProvider.debugInfoEnabled(false);

        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }        

        exceptionHandlerProvider.configure(config.appErrorPrefix);

        // Set prefix of localstorage
        localStorageServiceProvider.setPrefix('aries_');

        // intercept response
        $httpProvider.interceptors.push(interceptorFunction);

        interceptorFunction.$inject = ['$q', '$injector'];
        
        /* @ngInject */
        function interceptorFunction($q, $injector) {
            return {
                request: function (config) {
                    var authService = $injector.get('authService');

                    if (authService.isAuthenticated().success) {
                        config.headers['auth-token'] = authService.token();
                    }

                    return config;
                },
                responseError: function (rejection) {
                    var authService = $injector.get('authService'),
                        $state = $injector.get('$state');

                    // error - was it 401 or something else?
                    if (rejection.status === 401) {
                        // Remove invalid token if exists
                        authService.logout();
                        $state.go('login', {message: 'Authentication failed!'});
                    }

                    return $q.reject(rejection); // not a recoverable error
                }
            };
        }
    }
})();