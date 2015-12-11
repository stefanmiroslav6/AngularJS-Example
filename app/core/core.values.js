/* global _ */

(function() {
    'use strict';

    angular
        .module('app.core')
        .value('KendoModels', {
        	RhcaplReport: {
        	    id: 'guid',
        	    fields: {
        	        guid: {
        	            type: 'number',
        	            editable: false,
        	            nullable: true
        	        },
        	        class: {},
        	        manufacturer: {},
        	        year: {},
        	        model: {},
        	        body: {},
        	        engine_type: {},
        	        mbase: {type: 'number'},
        	        lprice: {type: 'number'},
        	        cprice: {type: 'number'},
        	        price2: {type: 'number'},
        	        adjustment: {type: 'number'}
        	    }
        	}
        });
})();