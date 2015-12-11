(function () {
    'use strict';

    var core = angular.module('app.core');

    core.run(runFunction);

    runFunction.$inject = ['$rootScope', '$state', 'authService'];

    /* @ngInject */
    function runFunction($rootScope, $state, authService) {

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
            if (toState.name === 'login') {
                if (authService.isAuthenticated().success) {
                    if (angular.isDefined($rootScope.returnTo)) {
                        $state.go($rootScope.returnTo.state, $rootScope.returnTo.params);
                    } else {
                        $state.go('site.dashboard');
                    }
                }
            } else {
                $rootScope.returnTo = {
                    state: toState,
                    params: toParams
                };

                // If the user is not authenticated and tries to browse the pages restricted
                if (angular.isDefined(toState.data.restricted) && toState.data.restricted) {
                    var auth = authService.isAuthenticated();

                    if (!auth.success) {
                        $state.go('login', {message: auth.message});

                        event.preventDefault();
                    }
                }
            }
        });
    }
})();