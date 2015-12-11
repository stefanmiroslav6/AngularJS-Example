/* jshint -W024 */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('apiService', serviceFunction);


    // ----- serviceFunction -----
    serviceFunction.$inject = ['$q', '$http', 'authService', 'ENV', '_'];

    /* @ngInject */
    function serviceFunction($q, $http, authService, ENV, _) {
        var baseUrl = ENV.baseUrl,
            serviceUrls = ENV.serviceUrls;

        var service = {
            searchRhcaplReport: searchRhcaplReport,
            getRhcaplReportCsvUrl: getRhcaplReportCsvUrl,
            getRhcaplImportUrl: getRhcaplImportUrl
        };

        return service;
        
        function buildQueryString(baseUrl, params) {
            var queryString = baseUrl;

            if (!_.isEmpty(params)) {
                queryString += '?';
                queryString += _.map(params, function(val, key) {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(val);
                }).join('&');
            }

            return queryString;
        };

        function searchRhcaplReport(params) {
            return $http({
                method: 'GET',
                url: baseUrl + serviceUrls.rhcapl_report,
                params: params
            });
        };

        function getRhcaplReportCsvUrl() {
            var params = {
                auth: authService.token(),
                download: true
            };

            return buildQueryString(baseUrl + serviceUrls.rhcapl_report, params);
        };

        function getRhcaplImportUrl() {
            return baseUrl + serviceUrls.rhcapl_import;
        };
        
        return methods;
    }
})();