'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:CategoryCtrl
 * @description
 * # CategoryCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
.controller('EventCreateCtrl', ['$scope', '$location', '$filter', 'LoopBackAuth', 'ModalService', 'Category', 'Event',
			function ($scope, $location, $filter, LoopBackAuth, ModalService, Category, Event) {	
	
	/**
	 *  Setting timepicker  
	**/
	var today = new Date();
    today.setHours(today.getHours());
    today.setMinutes(today.getMinutes());
    
    $scope.date = today.getFullYear() + '-' + (today.getMonth()+1) +'-' + today.getDate(),
    $scope.time = today;

	$scope.hstep = 1;
  	$scope.mstep = 10;				

	/**
	 *  init model
	**/				
	$scope.selected_eventType = [];
	$scope.selected_topic = [];	
	$scope.inserted_tag = [];	

	$scope.model = {
		userId: LoopBackAuth.currentUserId,
		type:[],
		topic:[],
		field:[],
		datetime: null,
		title:'',
		link:'',
		price: false,		
		place:{
			province: '',
			address: ''
		}
	}


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
	 *  select category 
	**/
    $scope.openCategory = function(title, id, name) {			   

    	$scope.data = [];

		Category
		.categoryChild({			
			id: id,
			filter: {           
	            fields: {
	                name: true
	            },
	            order: "order ASC"
	        }
		})
		.$promise
	    .then(
	    function (res) {   
	    	$scope.data = $scope.data.concat(res);   
	    	$scope.openCategoryModal(title, $scope.data, name);                              
	    },
	    function (err) {                            
	        console.log('err', err);
            alert(err.data.error.message);
	    });

    };

    $scope.openCategoryModal = function(title, items, name) {			
    	
    	if(!$scope.open){    		
			
    		//prevent double click 
    		$scope.open = true;
	    	
	    	ModalService.showModal({
	            templateUrl: "components/modal/category.html",
	            controller: "ModalCategoryCtrl",     
	            inputs: {
	            	title: title,
	                items: items,
	                selected: $scope.model[name]
	            },       
	        }).then(function(modal) {
	            modal.element.modal();
	            modal.close.then(function(res) {
	            	if(null !==res) $scope.model[name] = res.arr;	            	
	            });
	        });	   

	        setTimeout(function(){ $scope.open = false; }, 1000);
    	}

    };

    /**
	 *  Event Create
	**/
	$scope.create = function() {

		// 시간 조합
		$scope.model.datetime = new Date($scope.date);
		$scope.model.daybyday = $scope.date;
		$scope.model.datetime.setHours($scope.time.getHours());
		$scope.model.datetime.setMinutes($scope.time.getMinutes());

		// 태그 변환(object -> array)
		// $scope.model.field = $scope.model.field.map(function(tag) { return tag.text; });

		// 태그 array 생성
		$scope.model.field = [];

  		angular.forEach($scope.inserted_tag, function (values, i) {    
			
			if(!$scope.model.field.includes(values.name)) $scope.model.field.push(values.name);

			// 태그 대분류 item 주입
			angular.forEach(values.item, function (item, i) {    
				if(!$scope.model.field.includes(item)) $scope.model.field.push(item);
			});                                                               			
		});                                                  

		Event
		.create($scope.model)
		.$promise
	    .then(
	    function (res) {               
	        // $location.nextAfterLogin = $location.path();
         	// $location.path('/event/list/true');			
         	location.reload(); 
	    },
	    function (err) {                            
	        console.log('err', err);
            alert(err.data.error.message);
	    });

    };


    /** 
     *	Datetimepicker Bindable functions
	**/
	$scope.$watch('date', function (newValue) {
	    $scope.date = $filter('date')(newValue, 'yyyy-MM-dd'); // Or whatever format your real model should use
	});

	
}]);