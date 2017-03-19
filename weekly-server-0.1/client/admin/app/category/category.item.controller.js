'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:CategoryListCtrl
 * @description
 * # CategoryListCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
.controller('CategoryItemCtrl', ['$scope', '$stateParams', '$window', '$location', 'Category', 'CategoryChild',
	function ($scope, $stateParams, $window, $location, Category, CategoryChild) {


	/**
	 *  get Items	 
	**/		
	$scope.data = [];
	$scope.depth = $stateParams.depth;

	Category
    .categoryChild({    	
    	id: $stateParams.id,
    	filter: {
    		order: "order ASC"
    	}
    })
    .$promise
    .then(
    function (res) {      
    	$scope.data = $scope.data.concat(res);                     
    },
    function (err) {                            
        console.log('err', err);
        alert(err.data.error.message);
    });		


    /**
	 *  remove Item	 
	**/
	$scope.remove = function () {
		$scope.remove();
	};

	/**
	 *  add Item	 
	**/
	$scope.newItem = function () {
				
		// var nodeData = $scope.data[$scope.data.length - 1];
		
		$scope.data.push({
			categoryId: $stateParams.id,	
			name: null
		});
	};


	/**
	 *  save changed items 
	**/
	$scope.save = function () {
	
		Category
        .categoryChild
        .destroyAll({
            id: $stateParams.id,
        })
        .$promise
        .then(
        function (res) {               
            if($scope.depth <=1) $scope.createMany();
            else $scope.createManyItem();
        },
        function (err) {                            
            console.log('err', err);
            alert(err.data.error.message);
        });

	};

	/**
	 *  depth 1 items save
	**/
	$scope.createMany = function () {

		angular.forEach($scope.data, function (values, i) {      			
 			values.order = i;
		});                   

		CategoryChild
		.createMany($scope.data)
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
	 *  depth 2 items save
	**/
	$scope.createManyItem = function () {

  		$scope.save = [];

  		// extract text value in tag object
  		angular.forEach($scope.data, function (values, i) {    
  			
  			var obj = {};
  			var arr = [];

  			if(null != values.item){  				
	  			values.item.map(function(tag) { 
	  				arr.push(tag.text);
	  			});
  			}

  			obj.categoryId = values.categoryId;
  			obj.order = i;
  			obj.name = values.name;
  			obj.item = arr;

  			$scope.save.push(obj);  			
		});                                                               

		CategoryChild
		.createMany($scope.save)
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
