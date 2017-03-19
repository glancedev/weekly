'use strict';

angular.module('adminApp')
.config(['$stateProvider', function($stateProvider) {    

	$stateProvider
    .state('person/list', {
        url: '/person/list',
        templateUrl: 'app/person/person.list.html',
        controller: 'PersonListCtrl'
    })
    .state('person/create', {
        url: '/person/create',
        templateUrl: 'app/person/person.create.html',
        controller: 'PersonCreateCtrl'
    })
    .state('person/view/:id', {
        url: '/person/view/:id',
        templateUrl: 'app/person/person.view.html',
        controller: 'PersonViewCtrl'
    })    
    ;

}]);