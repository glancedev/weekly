'use strict';

angular.module('testApp')
  .controller('SettingsCtrl', function ($scope, $state, $stateParams, $http, $location, User, Auth) {
    
    $scope.errors = {};
    $scope.email = $stateParams.email;

    $scope.sendMail = function(form) {
        $scope.submitted = true;

        if(form.$valid) {
          
            User
            .resetPassword({email: $scope.email})
            .$promise
            .then(
              function (res) {
                console.log('res', res);
                $location.path("password_sended/"+$scope.email);
              },
              function (err) {
                  alert("등록되지 않은 이메일 주소입니다. 다시 확인해주세요.");
              });
        }

    };

    $scope.changePassword = function(form) {
      
        $http.defaults.headers.common.Authorization = $stateParams.access_token;

        User
        .patchAttributes(
          { id: $stateParams.user_id },   // 사용자 아이디
          { password: $scope.newPassword }  //  변경 필드
        )
        .$promise
        .then(function (res) {            
          console.log('res', res);
          $location.path('/password_change_done');
        },
        function (err) {
          console.log('err', err);          
        });

      };    

  });