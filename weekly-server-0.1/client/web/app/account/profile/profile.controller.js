'use strict';

angular.module('testApp')
  .controller('ProfileCtrl', function ($scope, $window, $location, User, Auth, LoopBackAuth) {
    $scope.errors = {};

    $scope.LoopBackAuth = LoopBackAuth;
    $scope.getCurrentUser = Auth.getCurrentUser;
    console.log(LoopBackAuth.currentUserId);

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
          .then( function() {
            $scope.message = 'Password successfully changed.';
          })
          .catch( function() {
            form.password.$setValidity('mongoose', false);
            $scope.errors.other = 'Incorrect password';
            $scope.message = '';
          });
      }
    };

    // request body
    // $scope.user = {
    //   username : '',  // 이름
    //   email : '',  // 이메일
    //   password: 'dividivi',  // 비번
    //   company: '',   // 소속
    //   position: '',  // 직책
    //   institution: '' // 결제기관
    // };


    /**
     *  User profile change
     **/
    $scope.user = {};

    $scope.ProfileChange = function(){

    User
      .patchAttributes(
        { id: LoopBackAuth.currentUserId },   // 사용자 아이디
        $scope.user    //  변경 필드
      )
      .$promise
      .then(
        function (res) {
          console.log('user change ', res);
          $scope.message = 'Profile Updated';
          // $location.path('/profile');
          // $state.transitionTo("profile");
          $window.location.reload();
        },
        function (err) {
          console.log('err', err);
          alert(err.data.error.message);

        });

    };

    /**
     *  User UserLeave
     **/



    $scope.UserLeave = function(){

      User
        .patchAttributes(
          { id: LoopBackAuth.currentUserId },   // 사용자 아이디
          { leave: true }  //  변경 필드
        )
        .$promise
        .then(
          function (res) {
            console.log('user leave ', res);
            Auth.logout();
            $location.path('/news');
          },
          function (err) {
            console.log('err', err);
            alert(err.data.error.message);

          });

    };

    $scope.sub_menu2 = [
      { title: '계정 정보', icon: '', link: 'profile' },
      { title: '계정 해지', icon: '', link: 'profile_out' }
    ];

  });
