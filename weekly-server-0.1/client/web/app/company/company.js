'use strict';

angular.module('testApp')
  .config(function ($stateProvider) {
    $stateProvider
      // .state('company', {
      //   url: '/company',
      //   templateUrl: 'app/company/company.html',
      //   controller: 'CompanyCtrl',
      //   authenticate: true
      // })
      .state('startup', {
        url: '/startup',
        templateUrl: 'app/company/company_startup.html',
        controller: 'CompanyStartupCtrl'
      })
      .state('vc', {
        url: '/vc',
        templateUrl: 'app/company/company_vc.html',
        controller: 'CompanyVcCtrl'
      })
      .state('ac', {
        url: '/ac',
        templateUrl: 'app/company/company_ac.html',
        controller: 'CompanyAcCtrl'
      })
      .state('companydetail', {
        url: '/company/:id',
        templateUrl: 'app/company/company_detail.html',
        controller: 'CompanyDetailCtrl'
      })
    ;
  });