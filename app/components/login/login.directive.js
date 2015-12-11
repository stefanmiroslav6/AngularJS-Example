(function() {
    'use strict';

    angular.module('app.login')
        .directive('ariesLogin', directiveFunction)
        .controller('LoginController', ControllerFunction);

    // ----- directiveFunction -----
    directiveFunction.$inject = [];

    /* @ngInject */
    function directiveFunction() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/login/login.html',
            scope: {},
            controller: 'LoginController',
            controllerAs: 'vm'
        };

        return directive;
    }

    // ----- ControllerFunction -----
    ControllerFunction.$inject = ['$rootScope', '$state', '$stateParams', 'authService'];

    /* @ngInject */
    function ControllerFunction($rootScope, $state, $stateParams, authService) {
        
        var vm = this;
        
        vm.username = '';
        vm.password = '';
        vm.errorMessage = '';
        vm.login = login;

        init();
        
        function init() {
            if ($stateParams.message) {
                vm.errorMessage = $stateParams.message;
            }
        }

        function login() {
            authService.login(vm.username, vm.password).then(function(response) {
                if (angular.isDefined($rootScope.returnTo)) {
                    $state.go($rootScope.returnTo.state, $rootScope.returnTo.params);
                } else {
                    $state.go('site.dashboard');
                }
            }, function() {
                vm.errorMessage = 'Authentication failed.';
            });
        }
    }
})();