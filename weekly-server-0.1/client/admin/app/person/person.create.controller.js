'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:PersonCreateCtrl
 * @description
 * # PersonCreateCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
.controller('PersonCreateCtrl', ['$scope', '$location', '$filter', 'LoopBackAuth', 'ModalService', 'Category', 
		'Person', 'Company', 'FileUploader', 'bsLoadingOverlayService',
			function ($scope, $location, $filter, LoopBackAuth, ModalService, Category, 
				Person, Company, FileUploader, bsLoadingOverlayService) {	
	
	/**
	 *  init model
	**/				
	$scope.model = {
		type: [],
		userId: LoopBackAuth.currentUserId,
		name:'',
		education: [],
		company: [],
		gender: 'm'
	}

	// array education
	$scope.educations = [];

	// array experience
	$scope.experiences = [];

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
	 *  category item 
	**/
    $scope.getCategory = function(id, name, order, type) {			       	
    	$scope[name] = [];

    	Category
		.categoryChild({			
			id: id,
			filter: {           
	            fields: {
	                name: true,
	                item: true
	            },
	            order: order
	        }
		})
		.$promise
	    .then(
	    function (res) {       	
	    	if(type) $scope[name] = $scope[name].concat(res); 
	    	else 
	    	{
	    		angular.forEach(res, function(value){    
		    		$scope[name].push(value.name);
		        });       
	    	}
	    },
	    function (err) {                            
	        console.log('err', err);
	        alert(err.data.error.message);
	    });  
    };


    /**
	 *  push item to model array 
	**/
    $scope.changeCheckbox = function(name, val){

    	var index = $scope.model[name].indexOf(val);

	  	if(index < 0) $scope.model[name].push(val)
	  	else $scope.model[name].splice(index,1); 
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
	 *  validate max tag count
	**/
	$scope.checkMaxTags = function(index, max) {

      	if($scope.experiences[index].company.length > max) {      		      	
			$scope.experiences[index].company.pop();        	
      	}
      	else if($scope.experiences[index].company.length == max) {      		      	
			angular.element( document.querySelector('#auto-complete-'+index)).css('display', 'none');
      	}
      	else{
      		angular.element( document.querySelector('#auto-complete-'+index)).css('display', 'block');
      	}
    };

	/**
	 *  add Item	 
	**/
	$scope.newItem = function (name) {
					
		if(name == 'educations')
		{
			$scope.educations.push({
				school: null,
				degree: null,
				major: null,
				dateFrom: null,
				dateTo: null
			});
		}
		else
		{			
			$scope.experiences.push({
				// employeeName: $scope.model.name,
				company: [],				
				position: null,
				dateFrom: null,
				dateTo: null
			});
		}

	};

    /**
	 *  Person Create
	**/
	$scope.create = function() {		

		// loading start
		bsLoadingOverlayService.start();	

		// 태그 array 생성
		$scope.model.field = [];
		
		angular.forEach($scope.inserted_tag, function (value, i) {    
			
			if(!$scope.model.field.includes(value.name)) $scope.model.field.push(value.name);

			// 태그 대분류 item 주입
			angular.forEach(value.item, function (item, i) {    
				if(!$scope.model.field.includes(item)) $scope.model.field.push(item);
			});                                                               			
		});                        		

		// 경력 정보 추가
		angular.forEach($scope.experiences, function (value, i) {    
						
			value.companyId = value.company[0].id; 
			// value.companyName = value.company[0].name;

			//model company 정보 추가 (이전 직장 검색 용도)
			$scope.model.company.push(value.companyId);

			delete value.company;
		});     

		// 학력 정보 추가
		if($scope.educations.length > 0) $scope.model.education = $scope.educations;

		Person
		.create($scope.model)
		.$promise
	    .then(
	    function (res) {           

	    	if($scope.experiences.length>0)
	    	{
	    		// insert experiences array
				Person
				.employee
				.createMany(
					{id: res.id},
					$scope.experiences
				)
				.$promise
			    .then(
			    function (res) {			    
			    	// reload page
			    	location.reload(); 	    		
			    },
			    function (err) {                            
			        console.log('err', err);
		            alert(err.data.error.message);
		            bsLoadingOverlayService.stop();
			    });
	    	}
	    	
	    	// file upload
            if(uploader.queue.length > 0) $scope.upload_file(res.id); 
            else location.reload(); 

	    },
	    function (err) {                            
	        console.log('err', err);
            alert(err.data.error.message);
            bsLoadingOverlayService.stop();
	    });

    };

    /**
     * multiple file upload
    **/ 
    var uploader = $scope.uploader = new FileUploader({queueLimit: 1});

    uploader.filters.push({
	    name: 'imageFilter',
	    fn: function(item /*{File|FileLikeObject}*/, options) {	    	
	        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
	        uploader.queue = [];
	        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
	    }
	});

    $scope.upload_file = function(id) {			
    	 
		uploader.onBeforeUploadItem = function(item) {
	      	item.url = '/api/thumbnails/upload?personId=' + id	     
	    };

	    uploader.uploadAll();
    };

    uploader.onCompleteAll = function() {
	    // reload page
	    location.reload(); 
    };


    /** 
     *  watch exprience array user name 
    **/
    // $scope.$watch('model.name', function (newValue) {
    //     if($scope.experiences.length > 0){
    //         angular.forEach($scope.experiences, function(value){                                
    //             value.employeeName = newValue; // Or whatever format your real model should use                              
    //         });               
    //     } 
    // });

    /** 
     *	Datetimepicker Bindable functions
	**/
	$scope.$watch('model.birth', function (newValue) {
	    $scope.model.birth = $filter('date')(newValue, 'yyyy-MM-dd'); // Or whatever format your real model should use
	});

	$scope.baseValueChange = function(name, index, key, newValue) {
		$scope[name][index][key] = $filter('date')(newValue, 'yyyy-MM-dd'); // Or whatever format your real model should use	    			
	}

	$scope.startDateOnSetTime = function(name) {
	  	$scope.$broadcast(name);
	}

	$scope.endDateOnSetTime = function(name) {
	  $scope.$broadcast(name);
	}

	$scope.startDateBeforeRender = function($dates, name, index, key) {
	  	if ($scope[name][index][key]) {
	    	var activeDate = moment($scope[name][index][key]);

	    	$dates.filter(function (date) {
	      		return date.localDateValue() >= activeDate.valueOf()
	    	}).forEach(function (date) {
	      		date.selectable = false;
	    	})
	  	}
	}

	$scope.endDateBeforeRender = function($view, $dates, $leftDate, $upDate, $rightDate, name, index, key) {
	  	if ($scope[name][index][key]) {
	    	var activeDate = moment($scope[name][index][key]).subtract(1, $view).add(1, 'minute');

	    	$dates.filter(function (date) {
	      		return date.localDateValue() <= activeDate.valueOf()
	    	}).forEach(function (date) {
	      		date.selectable = false;
	    	})
	  	}
	}
	
}]);