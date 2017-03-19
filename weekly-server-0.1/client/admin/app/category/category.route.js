'use strict';

angular.module('adminApp')
.config(['$stateProvider', function($stateProvider) {   

	$stateProvider
    .state('category/list', {
        url: '/category/list',
        templateUrl: 'app/category/category.list.html',
        controller: 'CategoryListCtrl'
    })
    .state('category/create', {
        url: '/category/create',
        templateUrl: 'app/category/category.create.html',
        controller: 'CategoryCreateCtrl'
    })
    .state('category/item/:depth/:id', {
        url: '/category/item/:depth/:id',
        templateUrl: 'app/category/category.item.html',
        controller: 'CategoryItemCtrl'
    })
    .state('category/view/:id', {
        url: '/category/view/:id',
        templateUrl: 'app/category/category.view.html',
        controller: 'CategoryViewCtrl'
    })
    ;

}]);