'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:NewsCreateCtrl
 * @description
 * # NewsCreateCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
.controller('NewsCreateCtrl', ['$scope', '$location', '$filter', 'LoopBackAuth', 'ModalService', 'bsLoadingOverlayService',
	'Category', 'Person', 'Company', 'Product', 'News',
			function ($scope, $location, $filter, LoopBackAuth, ModalService, bsLoadingOverlayService,
				 Category, Person, Company, Product, News) {	
	
	/**
	 *  Setting timepicker  
	**/
	var today = new Date();
    today.setHours(today.getHours());
    today.setMinutes(today.getMinutes());
    $scope.time = today;

	$scope.hstep = 1;
  	$scope.mstep = 10;

	/**
	 *  init model
	**/				
	$scope.model = {
		type: '',
		userId: LoopBackAuth.currentUserId,
		title:'',
		datetime: today.getFullYear() + '-' + (today.getMonth()+1) +'-' + today.getDate(),
		company: [],
		person: [],
		product: []
	};

	// 기업공개
	$scope.model_ipo = {
		company: []
	};
	// 인수합병
	$scope.model_mna = {
		hands: [],
		takes: []
	};
	// 투자유치
	$scope.model_investment = {
		investees: [],
		company: [],
		person: []
	};

	// news article
	$scope.newsCompany = [];
	$scope.newsPerson = [];

	/**
	 *  get person category item 
	**/
    $scope.getPersonCategory = function() {			       	
    	$scope.items_person = [];

    	Person
        .search({
        	filter: {
	            order: "name ASC"
	        }
        })
        .$promise
        .then(
        function (res) {          
            $scope.items_person = $scope.items_person.concat(res);   
        },
        function (err) {                
            console.log('err', err);
            alert(err.data.error.message);
        });     
    };

    /**
	 *  get product category item 
	**/
    $scope.getProductCategory = function() {			       	
    	$scope.items_product = [];

    	Product
        .find({
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
            $scope.items_product = $scope.items_product.concat(res);   
        },
        function (err) {                
            console.log('err', err);
            alert(err.data.error.message);
        });     
    };

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
	 *  push item to model array 
	**/
    $scope.changeCheckbox = function(name, val){

    	var index = $scope.model[name].indexOf(val);

	  	if(index < 0) $scope.model[name].push(val)
	  	else $scope.model[name].splice(index,1);	  	 
	};

	/**
	 *  validate max tag count
	**/
	$scope.checkMaxTags = function(model, name, max) {

      	if($scope[model][name].length > max) {      		      	
			$scope[model][name].pop();        	
      	}
      	else if($scope[model][name].length == max) {      		      	
			angular.element( document.querySelector('#auto_'+model+'_'+name)).css('display', 'none');
      	}
      	else{
      		angular.element( document.querySelector('#auto_'+model+'_'+name)).css('display', 'block');
      	}
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
	            }
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
	 *  News Create
	**/
	$scope.create = function() {		

		// 시간 조합
		$scope.model.datetime = new Date($scope.model.datetime);
		$scope.model.datetime.setHours($scope.time.getHours());
		$scope.model.datetime.setMinutes($scope.time.getMinutes());

		// loading start
		bsLoadingOverlayService.start();

		// 태그 array 생성
		$scope.model.field = [];
		
		angular.forEach($scope.inserted_tag, function (values, i) {    
			
			if(!$scope.model.field.includes(values.name)) $scope.model.field.push(values.name);

			// 태그 대분류 item 주입
			angular.forEach(values.item, function (item, i) {    
				if(!$scope.model.field.includes(item)) $scope.model.field.push(item);
			});                                                               			
		});                        

		// person tag 생성
		// 태그 변환(object -> array)
		if($scope.model.person.length > 0){
			$scope.model.personIds = $scope.model.person.map(function(tag) { return tag.id; });
			$scope.newsPerson = $scope.model.person.map(function(tag) { return {personId:tag.id}; });
		}


		// // product tag 생성
		// // 태그 변환(object -> array)
		if($scope.model.product.length > 0){
			$scope.model.productIds = $scope.model.product.map(function(tag) { return tag.id; });			
		}

		// // comapny tag 생성
		// // 태그 변환(object -> array)
		if($scope.model.company.length > 0){			
			$scope.model.companyIds = $scope.model.company.map(function(tag) { return tag.id; });
			$scope.newsCompany = $scope.model.company.map(function(tag) { return {companyId:tag.id}; });
		}

		delete $scope.model.person;
		delete $scope.model.product;
		delete $scope.model.company;

		News
		.create($scope.model)
		.$promise
	    .then(
	    function (res) {               

	    	var newsId = res.id;

	    	//create news company releation
	    	if($scope.newsCompany.length > 0)
	    	{	    
	    		// set loading
	    		$scope.newsCompanyLoading = true;

	    		// comapny tag 생성
				// 태그 변환(object -> array)
	    		// $scope.newsCompany = $scope.model.company.map(function(tag) { return {newsId:newsId, companyId:tag.id}; });
	    		$scope.newsCompany.newsId = newsId;

	    		// create models
	    		$scope.createRelationModel('newsCompany', 'createMany', newsId, $scope.newsCompany);
			}

	    	//create news person releation
	    	if($scope.newsPerson.length > 0)
	    	{
	    		// set loading
	    		$scope.newsPersonLoading = true;

	    		// comapny tag 생성
				// 태그 변환(object -> array)
	    		// $scope.newsPerson = $scope.model.person.map(function(tag) { return {newsId:newsId, personId:tag.id}; });
	    		$scope.newsPerson.newsId = newsId;

	    		// create models
	    		$scope.createRelationModel('newsPerson', 'createMany', newsId, $scope.newsPerson);
	    	}

			
			// create relation model
	    	if($scope.model.type === '기업공개') //create IPO model
	    	{
	    		// set loading
	    		$scope.ipoLoading = true;

	    		// insert ipo relation companyId
	    		if($scope.model_ipo.company.length > 0)
	    		{
		    		$scope.model_ipo.companyId = $scope.model_ipo.company[0].id;
		    		// $scope.model_ipo.companyName = $scope.model_ipo.company[0].name;
	    		}
	    		
	    		delete $scope.model_ipo.company;	    		

	    		// 분야 태그 추가 
		    	$scope.model_ipo.field = $scope.model.field;
		    	$scope.model_ipo.link = $scope.model.link;
		    	$scope.model_ipo.title = $scope.model.title;
	    
	    		// create models
	    		$scope.createRelationModel('ipo', 'create', newsId, $scope.model_ipo);		    	
	    	}
	    	else if($scope.model.type === '인수합병') //create MNA model
	    	{
	    		// set loading
	    		$scope.mnaLoading = true;

	    		// insert mna relation handover
	    		if($scope.model_mna.hands.length > 0)
	    		{
		    		$scope.model_mna.handoverId = $scope.model_mna.hands[0].id;
		    		// $scope.model_mna.handover = $scope.model_mna.hands[0].name;
		    	}
		    	// insert mna relation takesover
		    	if($scope.model_mna.takes.length > 0)
	    		{
		    		$scope.model_mna.takeoverId = $scope.model_mna.takes[0].id;
		    		// $scope.model_mna.takeover = $scope.model_mna.takes[0].name;
		    	}

	    		delete $scope.model_mna.hands;
	    		delete $scope.model_mna.takes;

	    		// 분야 태그 추가 
	    		$scope.model_mna.field = $scope.model.field;
	    		$scope.model_mna.link = $scope.model.link;
	    		$scope.model_mna.title = $scope.model.title;

	    		// create models
	    		$scope.createRelationModel('mna', 'create', newsId, $scope.model_mna);		    	
	    	}
	    	else if($scope.model.type === '투자유치') //create INVESTMENT model
	    	{
	    		// set loading
	    		$scope.investmentLoading = true;	    	

	    		// insert investment relation investee
	    		if($scope.model_investment.investees.length > 0)
	    		{
		    		$scope.model_investment.investeeId = $scope.model_investment.investees[0].id;
		    		// $scope.model_investment.investee = $scope.model_investment.investees[0].name;
	    		}	
	    		// insert investment relation company
	    		if($scope.model_investment.company.length > 0)
	    		{
		    		// $scope.model_investment.investorCompanyId = $scope.model_investment.company[0].id;
		    		// $scope.model_investment.investorCompany = $scope.model_investmetvtrnt.company[0].name;
		    		$scope.model_investment.companyIds = $scope.model_investment.company.map(function(tag) { return tag.id; });
	    		}
	    		// insert investment relation person
	    		if($scope.model_investment.person.length > 0)
	    		{
	    			// $scope.model_investment.investorPersonId = $scope.model_investment.person[0].id;
	    			// $scope.model_investment.investorPerson = $scope.model_investment.person[0].name;
	    			$scope.model_investment.personIds = $scope.model_investment.person.map(function(tag) { return tag.id; });
	    		}

	    		// 분야 태그 추가 
	    		$scope.model_investment.field = $scope.model.field;
	    		$scope.model_investment.link = $scope.model.link;
	    		$scope.model_investment.title = $scope.model.title;

	    		delete $scope.model_investment.investees;
	    		delete $scope.model_investment.company;
	    		delete $scope.model_investment.person;

	    		// create models
	    		$scope.createRelationModel('investment', 'create', newsId, $scope.model_investment);		    		    		
	    	}

			if($scope.checkLoading()) location.reload(); 
	    },
	    function (err) {                            
	        console.log('err', err);
            alert(err.data.error.message);
            bsLoadingOverlayService.stop();
	    });

    };

    /** 
     *	create relation model
	**/
    $scope.createRelationModel = function(name, action, newsId, param){

    	News[name][action]
    	(
			{id: newsId},
			param
		)
		.$promise
	    .then(
	    function (res) {			
			// chnage loading state	    	
	    	$scope[name+'Loading'] = false;

	    	// reload page
	    	if($scope.checkLoading()) location.reload(); 
	    },
	    function (err) {                            
	        console.log('err', err);
            alert(err.data.error.message);
            bsLoadingOverlayService.stop();
	    });
    };

    /** 
     *	check loading
	**/
    $scope.checkLoading = function(){
		if($scope.newsCompanyLoading) return false;
		if($scope.newsPersonLoading) return false;
		if($scope.ipoLoading) return false;
		if($scope.mnaLoading) return false;
		if($scope.investmentLoading) return false; 	    	          	

		return true;
    };

    /** 
     *	Datetimepicker Bindable functions
	**/
	$scope.$watch('model.datetime', function (newValue) {
	    $scope.model.datetime = $filter('date')(newValue, 'yyyy-MM-dd'); // Or whatever format your real model should use
	});

	$scope.$watch('model_ipo.announcementDate', function (newValue) {
	    $scope.model_ipo.announcementDate = $filter('date')(newValue, 'yyyy-MM-dd'); // Or whatever format your real model should use
	});

	$scope.$watch('model_mna.announcementDate', function (newValue) {
	    $scope.model_mna.announcementDate = $filter('date')(newValue, 'yyyy-MM-dd'); // Or whatever format your real model should use
	});

	$scope.$watch('model_investment.announcementDate', function (newValue) {
	    $scope.model_investment.announcementDate = $filter('date')(newValue, 'yyyy-MM-dd'); // Or whatever format your real model should use
	});

	
}]);