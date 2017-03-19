'use strict';

angular.module('testApp')
  .controller('SignupCtrl', function ($scope, Auth, User, $location, $window, $state) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {

      // 사용자 생성
        User
          .singUp($scope.user)
          .$promise
          .then(
          function (res) {
            console.log('res', res);
            $state.transitionTo("signup_done");
          },
          function (err) {
            console.log(err.data.error.message);

            if(err.data.error.message == 'code') alert('그룹 코드가 존재하지 않습니다.');
            else alert('아이디 또는 이메일이 사용중 입니다. 다른 정보를 입력하세요.');                          
          });
      }
    };

  });
