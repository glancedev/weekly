'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:CategoryListCtrl
 * @description
 * # CategoryListCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
.controller('CategoryViewCtrl', ['$scope', '$stateParams', '$window', '$location', 'Category', 'CategoryChild',
	function ($scope, $stateParams, $window, $location, Category, CategoryChild) {


	/**
     *  view baaner 
    **/ 
	$scope.model = [];

	Category
    .findById({    	
    	id: $stateParams.id    	
    })
    .$promise
    .then(
    function (res) {      
    	$scope.model = res;
    },
    function (err) {                            
        console.log('err', err);
        alert(err.data.error.message);
    });		    

    /**
	 *  save changed  
	**/
	$scope.save = function () {
	
		Category
        .upsert($scope.model)
        .$promise
        .then(
        function (res) {               
	        $location.nextAfterLogin = $location.path();
            $location.path('/category/list');			
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
		$window.history.back();
	};
		
}]);
