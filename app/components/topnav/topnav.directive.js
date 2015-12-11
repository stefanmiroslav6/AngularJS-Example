(function () {
    'use strict';

    angular
        .module('app.topnav')
        .directive('ariesTopnav', directiveFunction)
        .controller('TopnavController', ControllerFunction);


    // ----- directiveFunction -----
    directiveFunction.$inject = [];

    /* @ngInject */
    function directiveFunction() {

        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/topnav/topnav.html',
            scope: {
            },
            controller: 'TopnavController',
            controllerAs: 'vm'
        };

        return directive;
    }

    // ----- ControllerFunction -----
    ControllerFunction.$inject = ['$state', 'authService'];

    /* @ngInject */
    function ControllerFunction($state, authService) {
        var vm = this;
        
        vm.isCollapsed = true;
        vm.isAuthenticated = authService.isAuthenticated().success;
        vm.username = authService.username();
        vm.logout = logout;

        
        function logout() {
            authService.logout();
            $state.go('login');
        }
    }

})();
