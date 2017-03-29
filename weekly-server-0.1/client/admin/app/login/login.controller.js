'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
.controller('LoginCtrl', ['$scope', '$location', 'User', 'LoopBackAuth', 'localStorageService',
            function ($scope, $location, User, LoopBackAuth, localStorageService) { 


    /**
     *  setting credentials 
    **/
    var token_period = 60 * 60 * 24; //1 day

    $scope.credentials = {
        // userId: 'weekly',
        // password: 'weekly',
        userId: null,
        password: null,
        ttl: token_period,
        rememberMe: true
    };

    /**
     *  login 
    **/
    $scope.login = function() {

        $scope.loginLoading = true;
        $scope.loginError = false;

        User.login({
            include: 'user',
            rememberMe: $scope.credentials.rememberMe
        }, $scope.credentials,
        function (user) {

            console.log('res', user);           
            
            //유저에 권한 체크한다. 
            //Role 권한 체크. Role 권한이 없을 시 로그인을 거부한다. 
            if(null === user.roles || !user.roles)
            {
                User.logout({access_token: LoopBackAuth.accessTokenId});
                $scope.loginLoading = false;        
                $scope.loginError = 'Permission denied. Please request administrator.';
            } 
            else
            {
                var url = null
                var role = user.roles[0];            
                
                if(role == 'super') url = '/news/create';
                else if(role == 'admin') url = '/user/list';
                else url = '/'+role+'/create'; //Role이 'admin' or 'super'가 아니면 권한을 가지고 있는 Role 섹션으로 간다. 

                localStorageService.set('roles', user.roles);
                $location.nextAfterLogin = $location.path();
                $location.path(url);              

            }   
            
            // $scope.getRoleNamesById(LoopBackAuth.currentUserId); 
        },
        function (err) {
            $scope.loginLoading = false;        
            $scope.loginError = 'The email or password you entered is incorrect.';
        });
    };

    /**
     *  Get user roles
    **/             
    // $scope.getRoleNamesById = function(id){         

    //     User
    //     .roleNames({
    //         id:id
    //     })
    //     .$promise
    //     .then(
    //     function (res) {   

    //      //Role 권한 체크. Role 권한이 없을 시 로그인을 거부한다. 
    //      if(null === res.roles || res.roles.length === 0)
    //      {
    //          User.logout({access_token: LoopBackAuth.accessTokenId});
    //             $scope.loginLoading = false;        
    //          $scope.loginError = 'Permission denied. Please request administrator.';
    //      } 
    //      else
    //      {
    //          var url = null
    //          var role = res.roles[0];

    //          console.log('role', role)

    //          //Role이 'admin' or 'super'가 아니면 권한을 가지고 있는 Role 섹션으로 간다. 
    //          if(role !== 'admin' && role !== 'super') url = '/'+role+'/list';
    //          else url = '/news/list';

    //          console.log(url)

    //          localStorageService.set('roles', res.roles);
    //          $location.nextAfterLogin = $location.path();
    //          $location.path(url);              

    //      }   
    //     },
    //     function (err) {                            
    //         console.log('err', err);
    //         $scope.loginLoading = false;
    //         alert(err.data.error.message);
    //     });            
    // };  

}]);