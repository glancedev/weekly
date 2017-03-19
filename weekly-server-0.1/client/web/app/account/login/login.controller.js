'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the adminApp
 */
angular.module('testApp')
.controller('LoginCtrl', ['$scope', '$window', '$location', 'User', 'LoopBackAuth', '$localStorage',
      function ($scope, $window, $location, User, LoopBackAuth, $localStorage) {

    $scope.user = {};
    $scope.errors = {};
    $scope.remeberMe = '';

    $scope.login = function(form) {
      $scope.submitted = true;

      User.login({
        include: 'user',
        rememberMe: $scope.remeberMe
      }, $scope.user,
      function (user) {
        console.log(user);

        if(user.err){
          return alert(user.message);
        } 
        else if(null == user.err && !user.id) {
          return alert('로그인 정보가 올바르지 않습니다.');
        }
        
        if(null != user.user.group) $localStorage.group = user.user.group
        else delete $localStorage.group;
      
        $window.location.reload();
        $location.path('/');
      },
      function (err) {
        console.log('err ', err);
        return alert('로그인 정보가 올바르지 않습니다.');
      });
    };

}]);