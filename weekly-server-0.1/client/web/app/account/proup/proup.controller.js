'use strict';

angular.module('testApp')
  .controller('ProupCtrl', function ($scope, Auth, $location, $window) {
    $scope.user = {};
    $scope.errors = {};

    $scope.sub_menu2 = [
      { title: '자주하는 검색', icon: 'fa-search', link: '#' },
      { title: '즐겨찾는 페이지', icon: 'fa-star-o', link: '#' },
      { title: '뉴스 보관함', icon: 'fa-bookmark-o', link: '#' }
    ];

  });
