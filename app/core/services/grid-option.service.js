/* jshint -W024 */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('gridOptionService', serviceFunction);


    // ----- serviceFunction -----
    serviceFunction.$inject = ['logger', 'KendoModels', 'apiService', '_'];

    /* @ngInject */
    function serviceFunction(logger, KendoModels, apiService, _) {
        var pageSize = 100;

        var service = {
            pageSize: pageSize,
            buildRhcaplReportGridOptions: buildRhcaplReportGridOptions
        };

        return service;

        /**
         * Grid option builder
         *
         * @param params
         *  model
         *  onRead
         *  columns
         *  detailTemplate
         */
        function buildGridOptions(params, customOptions) {
            params.data = params.data || '';
            params.total = params.total || '';
            params.serverPaging = params.serverPaging || false;
            params.serverSorting = params.serverSorting || false;

            var defaultOptions = {
                dataSource: {
                    schema: {
                        data: params.data,
                        model: params.model,
                        total: function (response) {
                            if (params.total) {
                                return response[params.total];
                            } else {
                                var data = params.data ? response[params.data] : response;
                                return data.length;
                            }
                        }
                    },
                    transport: {
                        read: params.onRead
                    },
                    pageSize: pageSize,
                    serverPaging: params.serverPaging,
                    sort: params.sort,
                    serverSorting: params.serverSorting
                },
                pageable: {buttonCount: 5},
                sortable: true,
                filterable: false, // {extra: false},
                selectable: 'row',
                dataBound: function (e) {
                    var grid = this;
                    var ds = grid.dataSource;

                    //if (ds.totalPages() <= 1) {
                    //    grid.pager.element.hide();
                    //} else {
                    //    grid.pager.element.show();
                    //}
                    if (ds._data.length === 0) {
                        var colCount = this.columns.length;
                        grid.tbody.append('<tr class=\'kendo-data-row\'>' +
                        '<td class=\'no-results-found\' colspan=\'' + colCount + '\'><b>No Results...</b></td>' +
                        '</tr>');
                    }
                }
            };

            angular.extend(defaultOptions, customOptions);

            return defaultOptions;
        }

        /**
         * Rhcapl report columns
         *
         * @param options
         * @returns []
         */
        function buildRhcaplReportGridColumns(options) {
            var columns = [
                {
                    field: 'guid',
                    title: 'GUID',
                    width: 100
                },
                {
                    field: 'class',
                    title: 'Class',
                    width: 70
                },
                {
                    field: 'manufacturer',
                    title: 'Manufacturer',
                    width: 70
                },
                {
                    field: 'year',
                    title: 'Year',
                    attributes: {class: 'text-right'},
                    width: 50
                },
                {
                    field: 'model',
                    title: 'Model',
                    width: 100
                },
                {
                    field: 'body',
                    title: 'Body',
                    width: 100
                },
                {
                    field: 'engine_type',
                    title: 'Engine Type',
                    width: 100
                },
                {
                    field: 'mbase',
                    title: 'M. base',
                    attributes: {class: 'text-right'},
                    width: 50
                },
                {
                    field: 'lprice',
                    title: 'L. Price',
                    attributes: {class: 'text-right'},
                    width: 50
                },
                {
                    field: 'cprice',
                    title: 'C. Price',
                    attributes: {class: 'text-right'},
                    width: 50
                },
                {
                    field: 'price2',
                    title: 'Price2',
                    attributes: {class: 'text-right'},
                    width: 50
                },
                {
                    field: 'adjustment',
                    title: 'Adjustment',
                    attributes: {class: 'text-right'},
                    width: 50
                }
            ];

            return columns;
        }

        function buildRhcaplReportGridOptions(options, gridOptions) {
            var readRhcaplReport = function (e) {
                if (_.isEmpty(e.data)) {
                    e.success({});
                    return;
                }

                var params = e.data;

                apiService.searchRhcaplReport(params).success(function (data) {
                    e.success(data);
                }).error(function (err) {
                    logger.log('Error in searching rhcapl report', err.message);
                    e.error();
                });
            };

            var gridOptionsExtended = angular.extend({
                columns: buildRhcaplReportGridColumns(options)
            }, gridOptions);

            return buildGridOptions({
                model: KendoModels.RhcaplReport,
                onRead: readRhcaplReport,
                data: 'rhcapl_report',
                total: 'total',
                serverPaging: true
            }, gridOptionsExtended);
        }
    }
})();