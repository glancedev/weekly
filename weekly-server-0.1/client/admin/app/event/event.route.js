'use strict';

angular.module('adminApp')
.config(['$stateProvider', function($stateProvider) {    

	$stateProvider
    .state('event/list/:active', {
        url: '/event/list/:active',
        templateUrl: 'app/event/event.list.html',
        controller: 'EventListCtrl'
    })
    .state('event/create', {
        url: '/event/create',
        templateUrl: 'app/event/event.create.html',
        controller: 'EventCreateCtrl'
    })
    .state('event/view/:active/:id', {
        url: '/event/view/:active/:id',
        templateUrl: 'app/event/event.view.html',
        controller: 'EventViewCtrl'
    })
    ;

}]);