/* jshint -W024 */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('gridResizeService', serviceFunction);


    // ----- serviceFunction -----
    serviceFunction.$inject = [];

    /* @ngInject */
    function serviceFunction() {
        var service = {
            resize: resize
        };

        return service;

        /**
         * Resize KendoGrid content when the window is resized
         *
         * @param gridElement
         */
        function resize(gridElement) {
            var dataArea = gridElement.find(".k-grid-content"),
                gridHeight = gridElement.innerHeight(),
                otherElements = gridElement.children().not(".k-grid-content"),
                otherElementsHeight = 0;

            otherElements.each(function() {
                otherElementsHeight += this.offsetHeight;
            });

            dataArea.height(gridHeight - otherElementsHeight);
        }
    }
})();