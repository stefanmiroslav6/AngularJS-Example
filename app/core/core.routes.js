/* jshint -W024 */
(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(configFunction);

    configFunction.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];

    /* @ngInject */
    function configFunction($locationProvider, $stateProvider, $urlRouterProvider) {

        // $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('login', {
                url: '/login',
                views: {
                    content: {
                        template: '<aries-login></aries-login>'
                    }
                }
            })
            .state('site', {
                abstract: true,
                views: {
                    nav: {
                        template: '<aries-topnav></aries-topnav>'
                    }
                },
                data: {
                    restricted: true
                }
            })
            .state('site.dashboard', {
                url: '/',
                views: {
                    'content@': {
                        template: '<aries-dashboard></aries-dashboard>'
                    }
                }
            })
            .state('site.report', {
                url: '/report',
                views: {
                    'content@': {
                        template: '<aries-report></aries-report>'
                    }
                }
            })
            .state('site.import', {
                url: '/import',
                views: {
                    'content@': {
                        template: '<aries-import></aries-import>'
                    }
                }
            });
    }
})();