'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
.controller('UserViewCtrl', ['$scope', '$window', '$stateParams', '$location', 'User', 'LoopBackAuth', 'bsLoadingOverlayService',
			function ($scope, $window, $stateParams, $location, User, LoopBackAuth, bsLoadingOverlayService) {	


	/**
     *  get user detail
    **/
    User
    .findById({     
        id: $stateParams.id,     
    })
    .$promise
    .then(
    function (res) {      

        $scope.model = res;                 
    },
    function (err) {                            
        console.log('err', err);
        alert(err.data.error.message);
        $scope.cancel();
    });       

    /**
     *  save 
    **/ 
	$scope.save = function() {

		bsLoadingOverlayService.start();	

		User
		.patchAttributes(
			{id: $stateParams.id},
			$scope.model
		)
		.$promise
	    .then(
	    function (res) {               

            $scope.cancel();            
	    },
	    function (err) {                            
	        console.log('err', err);
            alert(err.data.error.message);            
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

	
}]);