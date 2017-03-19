'use strict';

angular.module('adminApp')
.config(['$stateProvider', function($stateProvider) {   

	$stateProvider
    .state('subscriber/list/:type', {
        url: '/subscriber/list/:type',
        templateUrl: 'app/subscriber/subscriber.list.html',
        controller: 'SubscriberListCtrl'
    })
    .state('subscriber/create/:type', {
        params: {code: null, dueDate: null, company: null},
        url: '/subscriber/create/:type',
        templateUrl: 'app/subscriber/subscriber.create.html',
        controller: 'SubscriberCreateCtrl'
    })
    .state('subscriber/view/:type/:id', {
        url: '/subscriber/view/:type/:id',
        templateUrl: 'app/subscriber/subscriber.view.html',
        controller: 'SubscriberViewCtrl'
    });

}]);