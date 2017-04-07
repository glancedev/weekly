'use strict';

angular.module('testApp')
  .controller('NavbarCtrl', function ($scope, $window, $location, Auth, User, LoopBackAuth) {
    $scope.menu = [
      { 'title': '뉴스', 'link': 'news', 'links': 'news,invest,ipo,mna' },
      { 'title': '행사', 'link': 'event', 'links': 'event' },
      { 'title': '지원사업', 'link': 'business', 'links': 'business' },
      // { 'title': '회사/기관', 'link': 'startup', 'links': 'startup,ac,vc,companydetail' },
      // { 'title': '인물', 'link': 'person', 'links': 'person' }
    ];

    $scope.LoopBackAuth = LoopBackAuth; 

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.isGroupMember = Auth.isGroupMember;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.getCurrentUser().username;
      
    $scope.isLoggedIn = function(){
      return LoopBackAuth.accessTokenId !== null ? true : false;
    };


    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {      
      var path = $location.path().replace('/', '');
      // return route.includes(path);    
      return _.includes(route, path)

      // if (!$scope[arr].includes(value)) $scope[arr] = $scope[arr] + value;
      // if (!_.includes($scope[arr], value)) $scope[arr] = $scope[arr] + value;
    };

    $scope.goAdminPage = function(route) {      
      $window.location = '/admin';
    };    

    // web refresh
    $scope.refresh = function() {
      console.log('reload');
      $window.location.reload();
    };

  });
