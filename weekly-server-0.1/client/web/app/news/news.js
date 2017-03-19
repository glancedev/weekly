'use strict';

angular.module('testApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('news', {
        url: '/news',
        templateUrl: 'app/news/news.html',
        controller: 'NewsCtrl'
      })
      .state('invest', {
        url: '/invest',
        templateUrl: 'app/news/news_invest.html',
        controller: 'NewsInvestCtrl'
      })
      .state('mna', {
        url: '/mna',
        templateUrl: 'app/news/news_mna.html',
        controller: 'NewsMnaCtrl'
      })
      .state('ipo', {
        url: '/ipo',
        templateUrl: 'app/news/news_ipo.html',
        controller: 'NewsIpoCtrl'
      })
    ;
  });