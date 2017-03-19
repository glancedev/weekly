angular.module('adminApp')
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider',
	function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {   

	$httpProvider.interceptors.push(['$q', '$location', 'LoopBackAuth', function($q, $location, LoopBackAuth) {
  		return {
            'request': function(config) {

                //     $location.nextAfterLogin = $location.path();
                //     $location.path('/login');

                // 토큰이 없을 시, 로그인 페이지로 이동    
                if (LoopBackAuth.accessTokenId === null && config.url !== "app/login/login.html") {                                
                    $location.nextAfterLogin = $location.path();
                    $location.path('/login');
                }

                if (LoopBackAuth.accessTokenId !== null && config.url === "app/login/login.html") {                                
                    $location.nextAfterLogin = $location.path();
                    $location.path('/news/create');
                }

                return config;
            },   

    		responseError: function(rejection) {
                // 접근 권한 없는 페이지 접근시, 401 error 리턴          
                //401 error일 경우, User스토리지 삭제 후 Login page로 리턴
                if (rejection.status == 401) {
                    //Now clearing the loopback values from client browser for safe logout...
			        LoopBackAuth.clearUser();
			        LoopBackAuth.clearStorage();
                    localStorage.removeItem('ls.roles');   
			        $location.nextAfterLogin = $location.path();
			        $location.path('/login');
      			}                

	      		return $q.reject(rejection);
	    	}
	  	};
	}]);
}]);