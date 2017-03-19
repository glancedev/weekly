angular.module('adminApp')
.directive('eventSidebar', function () {
		return {
				restrict: 'A', //This menas that it will be used as an attribute and NOT as an element. I don't like creating custom HTML elements
				replace: true,
				scope: {user: '='}, // This is one of the cool things :). Will be explained in post.
				templateUrl: "app/event/event.sidebar.html",
				// controller: "UserCtrl"				
				controller: ['$rootScope', '$scope', '$state', '$filter', '$location', 'Event',
				function ($rootScope, $scope, $state, $filter, $location, Event) {
					
					/**
					 *   check class active
					**/
					$scope.isActive = function (path) {				
					  	return ($location.path().includes(path)) ? 'active' : '';
					}

					Event
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


			        Event
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