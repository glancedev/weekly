'use strict';

angular.module('adminApp')
.config(['$stateProvider', function($stateProvider) {    

	$stateProvider
    .state('company/list/:type', {
        url: '/company/list/:type',
        templateUrl: 'app/company/company.list.html',
        controller: 'CompanyListCtrl'
    })
    .state('company/create', {
        url: '/company/create',
        templateUrl: 'app/company/company.create.html',
        controller: 'CompanyCreateCtrl'
    })
    .state('company/view/:type/:id', {
        url: '/company/view/:type/:id',
        templateUrl: 'app/company/company.view.html',
        controller: 'CompanyViewCtrl'
    })    
    ;

}]);