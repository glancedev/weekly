'use strict';

angular.module('adminApp')
.config(['LoopBackResourceProvider', '$locationProvider', '$urlRouterProvider',
	function(LoopBackResourceProvider, $locationProvider, $urlRouterProvider) {  
    // Use a custom auth header instead of the default 'Authorization'
    LoopBackResourceProvider.setAuthHeader('X-Access-Token');
 
    // Change the URL where to access the LoopBack REST API server
    LoopBackResourceProvider.setUrlBase('/api');

	$locationProvider.html5Mode(true);
	
    $urlRouterProvider.otherwise('login');

}]);
