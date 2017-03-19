'use strict';

angular.module('adminApp')
.config(['$stateProvider', function($stateProvider) {    

	$stateProvider
    .state('news/list', {
        url: '/news/list',
        templateUrl: 'app/news/news.list.html',
        controller: 'NewsListCtrl'
    })
    .state('news/create', {
        url: '/news/create',
        templateUrl: 'app/news/news.create.html',
        controller: 'NewsCreateCtrl'
    })
    .state('news/view/:id', {
        url: '/news/view/:id',
        templateUrl: 'app/news/news.view.html',
        controller: 'NewsViewCtrl'
    })    
    ;

}]);