'use strict';

angular.module('adminApp')
.config(['$stateProvider', function($stateProvider) {   

	$stateProvider
    .state('business/list/:active', {
        url: '/business/list/:active',
        templateUrl: 'app/business/business.list.html',
        controller: 'BusinessListCtrl'
    })
    .state('business/create', {
        url: '/business/create',
        templateUrl: 'app/business/business.create.html',
        controller: 'BusinessCreateCtrl'
    })
    .state('business/view/:active/:id', {
        url: '/business/view/:active/:id',
        templateUrl: 'app/business/business.view.html',
        controller: 'BusinessViewCtrl'
    })
    ;

}]);