(function () {

    'use strict';

    angular.module('app.approot')
        .directive('ariesApproot', directiveFunction);        


    // ----- directiveFunction -----
    function directiveFunction() {

        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/approot/approot.html',
            scope: {}
        };

        return directive;
    }
})();
