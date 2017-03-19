'use strict';

angular.module('testApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('person', {
        url: '/person',
        templateUrl: 'app/person/person.html',
        controller: 'PersonCtrl'
      })
      .state('persondetail', {
        url: '/person/:id',
        templateUrl: 'app/person/person_detail.html',
        controller: 'PersonDetailCtrl'
      })
    ;
  });