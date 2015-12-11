(function(angular, undefined) {
'use strict';

angular.module('app.env', [])

.constant('ENV', {name:'production',baseUrl:'http://54.148.193.90:5000',serviceUrls:{login:'/api/login',profile:'/api/profile',year:'/api/years',make:'/api/makes',model:'/api/models',series:'/api/series',style:'/api/styles',location:'/api/locations',vehicle:'/api/vehicles',vehicles_by_ids:'/api/vehicles/by_ids',vehicles_by_vin:'/api/vehicles/by_vin',vehicle_aggs:'/api/vehicles/aggs',national_avg_price:'/api/vehicles/national_avg_price',dealer:'/api/dealers',dealer_aggs:'/api/dealers/aggs',sale_dates:'/api/sale_dates',pricing_overlays:'/api/pricing_overlays',graduated_circles:'/api/graduated_circles',rhcapl_report:'/api/rhcapl_report',rhcapl_import:'/api/rhcapl_import'}})

;
})(angular);