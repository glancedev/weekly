'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:BusinessListCtrl
 * @description
 * # BusinessListCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
.controller('BusinessCreateCtrl', ['$scope', '$location', '$filter', 'LoopBackAuth', 'ModalService', 'Business', 'Company', 'bsLoadingOverlayService',
			function ($scope, $location, $filter, LoopBackAuth, ModalService, Business, Company, bsLoadingOverlayService) {	
	
	/**
	 *  Setting timepicker  
	**/
	var today = new Date();

	/**
	 *  init model
	**/
	$scope.model = {
		userId: LoopBackAuth.currentUserId,
		title: '',
		link: '',
		organizations: '',
		deadline: today.getFullYear() + '-' + (today.getMonth()+1) +'-' + today.getDate(),
		ordinary: false,
		supportMoney: false,
		supportPlace: false
	}            


	/**
	 *  get company category item 
	**/
    $scope.getCompanyCategory = function() {			       	
    	$scope.items_company = [];

    	Company
        .search({
        	filter: {           
	            fields: {
	                id: true,
	                name: true
	            },
	            order: "name ASC"
	        }
        })
        .$promise
        .then(
        function (res) {          
            $scope.items_company = $scope.items_company.concat(res);   
        },
        function (err) {                
            console.log('err', err);
            alert(err.data.error.message);
        });     
    };


	/**
	 *  get tag items
	**/
  	$scope.loadTags = function(query, name) {

    	var tags = $scope[name];

    	// match word 
    	return tags.filter(function(tags) {    		
	        return tags.name.toLowerCase().indexOf(query.toLowerCase()) != -1;
	    });
	};	


	/**
	 *  Check ordinary
	**/
  	$scope.checkOrdinary = function() {
  		if($scope.model.ordinary) $scope.model.deadline = null;
	};	


	/**
	 *  Event Create
	**/
	$scope.create = function() {		

		// loading start
        bsLoadingOverlayService.start();	

		// 주관 company id 태그
		if(null != $scope.model.organizations){
			$scope.model.organizationIds = $scope.model.organizations.map(function(tag) { return tag.id; });
			delete $scope.model.organizations;			
		}

		Business
		.create($scope.model)
		.$promise
	    .then(
	    function (res) {               
	        // $location.nextAfterLogin = $location.path();
         	// $location.path('/business/list/true');	
         	location.reload(); 		
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
     *	Datetimepicker Bindable functions
	**/
	$scope.$watch('model.deadline', function (newValue) {
	    $scope.model.deadline = $filter('date')(newValue, 'yyyy-MM-dd'); // Or whatever format your real model should use
	});
	
}]);
