'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:CategoryCtrl
 * @description
 * # CategoryCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
.controller('CategoryCreateCtrl', ['$scope', '$location', 'Category', 'LoopBackAuth',
			function ($scope, $location, Category, LoopBackAuth) {	

	$scope.model = {
		id:'',
		name:'',
		depth: 1,
		description:''
	}

	$scope.actions = [1, 2];

	$scope.create = function() {		


		if(/^[0-9]+$/.test($scope.model.id))
		{
		    alert("Please make ID with at least 1 letter.")
		}
		else
		{			
			Category.create($scope.model)
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
		}	
    };

}]);