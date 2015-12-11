(function() {
    'use strict';

    angular.module('app.report')
        .directive('ariesReport', directiveFunction)
        .controller('ReportController', ControllerFunction);

    // ----- directiveFunction -----
    directiveFunction.$inject = [];

    /* @ngInject */
    function directiveFunction() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/report/report.html',
            scope: {},
            controller: 'ReportController',
            controllerAs: 'vm'
        };

        return directive;
    }

    // ----- ControllerFunction -----
    ControllerFunction.$inject = ['$scope', '$window', 'apiService', 'gridOptionService', 'gridResizeService'];

    /* @ngInject */
    function ControllerFunction($scope, $window, apiService, gridOptionService, gridResizeService) {
        
        var vm = this;      

        vm.exportDisabled = true;

        vm.rhcaplReportGridOptions = gridOptionService.buildRhcaplReportGridOptions({}, {
            autoBind: false,
            sortable: false,
            dataBound: function() {
                var grid = this;
                var ds = grid.dataSource;

                if (ds._data.length === 0) {
                    var colCount = this.columns.length;
                    grid.tbody.append('<tr class=\'kendo-data-row\'>' +
                    '<td class=\'no-results-found\' colspan=\'' + colCount + '\'><b>No Results...</b></td>' +
                    '</tr>');

                    vm.exportDisabled = true;
                } else {
                    vm.exportDisabled = false;
                }
            }
        });
        vm.onSearchClick = onSearchClick;
        vm.onExportClick = onExportClick;

        activate();

        function activate() {
            angular.element(document).ready(function () {
                angular.element($window).on('resize.rhcaplReportCtrl', function () {                    
                    gridResizeService.resize($scope.rhcaplReportGrid.element);
                });
            });

            $scope.$on('$destroy', function () {
                angular.element($window).off('resize.rhcaplReportCtrl');
            });
        }

        function onSearchClick() {
            // Disable export button while searching
            vm.exportDisabled = true;
            $scope.rhcaplReportGrid.dataSource.query({
                page: 1,
                pageSize: gridOptionService.pageSize
            });
        };

        function onExportClick() {
            var csvUrl = apiService.getRhcaplReportCsvUrl();

            $window.open(csvUrl, '_blank');
        };
    }
})();