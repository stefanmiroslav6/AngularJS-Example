(function() {
    'use strict';

    angular.module('app', [
        // Common (everybody has access to these)
        'app.core',
        'app.env',

        // Features (listed alphabetically)
        'app.approot',
        'app.dashboard',
        'app.import',
        'app.login',
        'app.report',
        'app.topnav'
    ]);
})();