angular.module('adminApp')
.directive('header', function () {
	return {
		restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
		// replace: true,
		scope: {user: '='}, // This is one of the cool things :). Will be explained in post.
		templateUrl: "components/header/header.html",
		controller: ['$scope', '$rootScope', '$window', '$location', '$filter', 'LoopBackAuth', 'UtilServices', 'localStorageService', 'User',
		function ($scope, $rootScope, $window, $location, $filter, LoopBackAuth, UtilServices, localStorageService, User) {				


			/**
			 *   LoopBackAuth Setting
			**/
			$scope.LoopBackAuth = LoopBackAuth;	

			if(LoopBackAuth.accessTokenId !== null) {
		      	User.getCurrent({
		        	id: LoopBackAuth.currentUserId
		      	},
		      	function (user) {		        
		        	if(user.type != 'admin'){
						$window.history.back(-2);

		        		User.logout({access_token: LoopBackAuth.accessTokenId});

		        		LoopBackAuth.clearUser();
		        		LoopBackAuth.clearStorage();
		        		localStorage.removeItem('ls.roles');
		        	}      
		      	},
		      	function (err) {
                	console.log("auth err", err);                
		      	});
		    }     


			// 사용자 role 체크
			if(localStorageService.get('roles') !== null)
			{
				$scope.userRoles = localStorageService.get('roles');			
			}
			else
			{
				// 로컬 스토리지가 null인 경우, 서버에 role 권한 요청을 보낸다.
				UtilServices.getUserRole(LoopBackAuth.currentUserId)
				.then(function(res){
					if(null === res || res.length === 0) // 응답이 null일 경우, 접근 제한 시킨다.
		        	{
		        		User.logout({access_token: LoopBackAuth.accessTokenId});
		        		alert('접근 권한이 없습니다.');	
		        	} 
		        	else
		        	{
						localStorageService.set('roles', res);
						$scope.userRoles = res;					
		        	}
				});
			}

			/**
			 *   logout
			**/
		    $scope.logout = function () {
		    	
		    	User
		        .logout({access_token: LoopBackAuth.accessTokenId})
		        .$promise
		        .then(
		        function (res, header) { 									        
		        	LoopBackAuth.clearUser();
	        		LoopBackAuth.clearStorage();
	        		localStorage.removeItem('ls.roles');

					var next = $location.nextAfterLogin || '/login';
					$location.nextAfterLogin = null;
					$location.path(next);
		        },
		        function (err) { 
		            console.log("login err", JSON.stringify(err));              
		        });		        				        
		    };


		    /**
			 *   check class active
			**/
			$scope.isActive = function (path) {				
			  	return ($location.path().includes(path)) ? 'active' : '';
			}


		}]
	}
});
