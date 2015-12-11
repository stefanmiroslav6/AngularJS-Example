/* jshint -W024 */
(function () {

    'use strict';

    angular.module('app.core')
        .directive('ariesBtnLoading', directiveFunction);


    // ----- directiveFunction -----
    function directiveFunction() {

        var directive = {            
            link: link
        };

        return directive;

        
        function link(scope, element, attrs) {
            scope.$watch(
                function () {
                    return scope.$eval(attrs.ariesBtnLoading);
                },
                function (value) {
                    if (value) {
                        element.button('loading');
                    } else {
                        element.button('reset');
                    }
                }
            );
        }
    }

})();
