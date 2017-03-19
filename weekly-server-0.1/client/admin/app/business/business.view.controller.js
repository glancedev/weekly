'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:BusinessListCtrl
 * @description
 * # BusinessListCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
.controller('BusinessViewCtrl', ['$scope', '$stateParams', '$window', '$location', '$filter', 
        'LoopBackAuth', 'ModalService', 'Business', 'Company', 'bsLoadingOverlayService',
			function ($scope, $stateParams, $window, $location, $filter, LoopBackAuth, ModalService, Business, Company, bsLoadingOverlayService) {	
    
    /**
     *  view Business
    **/ 	
	Business
    .findById({    	
    	id: $stateParams.id,    	
        filter:{     
            include:[
                {  
                    relation:'organizations',       
                    scope:{fields: ['id', 'name']}      
                }
            ]
        }
    })
    .$promise
    .then(
    function (res) {      
    	$scope.model = res;
    	$scope.model.modified = new Date();
    },
    function (err) {                            
        console.log('err', err);
        alert(err.data.error.message);
    });		

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
	 *  togle shitch
	**/
	$scope.changeSwitch = function(name) {			   
    	$scope.model[name] = $scope.model[name];
    };
    
	/**
	 *  save changed  
	**/
	$scope.save = function () {
        
        // loading start
        bsLoadingOverlayService.start();    

        // 주관 company id 태그
        if(null != $scope.model.organizations){
            $scope.model.organizationIds = $scope.model.organizations.map(function(tag) { return tag.id; });
            delete $scope.model.organizations;           
        }

		Business
        .upsert($scope.model)
        .$promise
        .then(
        function (res) {               
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

	$scope.cancel = function () {	
		$window.history.back();
	};




    /** 
     *	Datetimepicker Bindable functions
	**/
	$scope.$watch('model.deadline', function (newValue) {		
        if($scope.model) $scope.model.deadline = $filter('date')(newValue, 'yyyy-MM-dd'); // Or whatever format your real model should use
	});
	
}]);
