(function() {
    'use strict';

    angular.module('app.import')
        .directive('ariesImport', directiveFunction)
        .controller('ImportController', ControllerFunction);

    // ----- directiveFunction -----
    directiveFunction.$inject = [];

    /* @ngInject */
    function directiveFunction() {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/import/import.html',
            scope: {},
            controller: 'ImportController',
            controllerAs: 'vm'
        };

        return directive;
    }

    // ----- ControllerFunction -----
    ControllerFunction.$inject = ['$scope', '$injector', 'apiService', 'FileUploader'];

    /* @ngInject */
    function ControllerFunction($scope, $injector, apiService, FileUploader) {
        
        var vm = this;

        vm.uploader = null;
        vm.alert = null;
        vm.closeAlert = closeAlert;

        init();

        function init() {
            
            vm.uploader = new FileUploader({
                url: apiService.getRhcaplImportUrl(),
                headers: {
                    'auth-token': $injector.get('authService').token()
                },
                queueLimit: 2,
                //removeAfterUpload: true
            });

            // FILTERS
            vm.uploader.filters.push({
                name: 'imageFilter',
                fn: function(item, options) {
                    return item.type == 'application/vnd.ms-excel' || item.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                }
            });

            vm.uploader.onAfterAddingFile = function(fileItem) {
                if (vm.uploader.queue.length > 1) {
                    vm.uploader.removeFromQueue(0);
                }
                vm.alert = null;
            };

            vm.uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
                vm.alert = {
                    type: 'warning',
                    msg: "Please specify excel file."
                };
            };

            vm.uploader.onBeforeUploadItem = function(item) {
                vm.alert = null;
            };

            vm.uploader.onSuccessItem = function(fileItem, response, status, headers) {
                vm.alert = {
                    type: 'success',
                    msg: response.message
                };
            };

            vm.uploader.onErrorItem = function(fileItem, response, status, headers) {
                vm.alert = {
                    type: 'danger',
                    msg: response.message
                };
            };
        };

        function closeAlert() {
            vm.alert = null;
        };
    }
})();