'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:Subscriber
 * @description
 * # Subscriber
 * Controller of the adminApp
 */
angular.module('adminApp')
.controller('SubscriberCreateCtrl', ['$scope', '$stateParams', '$filter', '$window', '$location', 'User', 'Group', 'LoopBackAuth', 'bsLoadingOverlayService',
			function ($scope, $stateParams, $filter, $window, $location, User, Group, LoopBackAuth, bsLoadingOverlayService) {	

	$scope.model = {
		userId : '',
		username : '',
		email : '',
		password: '',
		type: $stateParams.type,
		available : true,
		code: $stateParams.code,
		company: $stateParams.company,
		dueDate: $stateParams.dueDate
	};


	// 마감일자 param이 널이면, 디폴트 마감일자는 지금 날짜 + 한달이다.
	if(null === $stateParams.dueDate){
        var today = new Date();		
		$scope.model.dueDate = today.setMonth(today.getMonth() + 1);			
	};

	// dropdown box option
	$scope.actions = ['group', 'private'];

	$scope.create = function() {

		// loading start
        bsLoadingOverlayService.start();    

		// 사용자 생성
		User
		.singUp($scope.model)
		.$promise
	    .then(
	    function (res) {           
	        // $location.nextAfterLogin = $location.path();
         //    $location.path('/subscriber/list/all');		
            $window.history.back();	
            // loading stop
            bsLoadingOverlayService.stop();
	    },
	    function (err) {                            
	        console.log('err', err);
            alert(err.data.error.message);
            // loading stop
            bsLoadingOverlayService.stop();
	    });

    };


    /**
     *  cancel button
    **/ 
    $scope.cancel = function () {   
        // loading stop
        bsLoadingOverlayService.stop();

        // reload page
        $window.history.back();
    };


    $scope.$watch('model.dueDate', function (newValue) {
	    $scope.model.dueDate = $filter('date')(newValue, 'yyyy-MM-dd'); // Or whatever format your real model should use
	});


	
}]);