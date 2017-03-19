'use strict';

angular.module('adminApp')
.config(['$stateProvider', function($stateProvider) {   

	$stateProvider
    .state('user/list', {
        url: '/user/list',
        templateUrl: 'app/user/user.list.html',
        controller: 'UserListCtrl'
    })
    .state('user/view/:id', {
        url: '/user/view/:id',
        templateUrl: 'app/user/user.view.html',
        controller: 'UserViewCtrl'
    })
    .state('user/create', {
        url: '/user/create',
        templateUrl: 'app/user/user.create.html',
        controller: 'UserCreateCtrl'
    });

}]);