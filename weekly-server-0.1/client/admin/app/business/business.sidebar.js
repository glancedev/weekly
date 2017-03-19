angular.module('adminApp')
.directive('businessSidebar', function () {
	return {
		restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
		replace: true,
		scope: {user: '='}, // This is one of the cool things :). Will be explained in post.
		templateUrl: "app/business/business.sidebar.html",
		// controller: "UserCtrl"				
		controller: ['$rootScope', '$scope', '$state', '$filter', '$location', 'Business',
		function ($rootScope, $scope, $state, $filter, $location, Business) {
			
			/**
			 *   check class active
			**/
			$scope.isActive = function (path) {		
			  	return ($location.path().includes(path)) ? 'active' : '';
			};
			
			Business
	        .count({
	            where: {                            
	                display: true
	            }
	        })
	        .$promise
	        .then(
	        function (res) {                       
	            $scope.activeCount = res.count;
	        },
	        function (err) {                            
	            console.log('err', err);
	            alert(err.data.error.message);
	        }); 


	        Business
	        .count({
	            where: {                            
	                display: false
	            }
	        })
	        .$promise
	        .then(
	        function (res) {                       
	            $scope.inactiveCount = res.count;
	        },
	        function (err) {                            
	            console.log('err', err);
	            alert(err.data.error.message);
	        }); 


		}]
	}
});