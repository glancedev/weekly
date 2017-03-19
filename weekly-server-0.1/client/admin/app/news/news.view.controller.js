'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:NewsViewCtrl
 * @description
 * # NewsViewCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
.controller('NewsViewCtrl', ['$scope', '$stateParams', '$location', '$q', '$window', '$filter', 'LoopBackAuth', 'ModalService', 
	'bsLoadingOverlayService', 'Category', 'Person', 'Company', 'Product', 'News',
			function ($scope, $stateParams, $location, $q, $window, $filter, LoopBackAuth, ModalService, 
				bsLoadingOverlayService, Category, Person, Company, Product, News) {	
	
	/**
	 *  init model
	**/				
	News
    .findById({     
        id: $stateParams.id,     
        filter: {
            include:[
                {relation:'newsCompany'},
                {relation:'newsPerson'},                                
                {
                	relation:'person',       
                	scope:{fields: ['id', 'name']}            
            	},
                {
                	relation:'company',       
                    scope:{fields: ['id', 'name']}      
                },
                {
                	relation:'product',       
                    scope:{fields: ['id', 'name']}
                },
                {relation:'ipo',       
                    scope:{
                        include:[
                            {  
                                relation:'company',       
                                scope:{fields: ['id', 'name']}      
                            }                        
                        ]                        
                    }      
                },
                {relation:'investment',
            		scope:{
                        include:[
                            {  
                                relation:'investee',       
                                scope:{fields: ['id', 'name']}      
                            },
                            {  
                                relation:'investorCompany',       
                                scope:{fields: ['id', 'name']}      
                            },
                            {  
                                relation:'investorPerson',       
                                scope:{fields: ['id', 'name']}      
                            }                        
                        ]                        
                    }      
                },
                {relation:'mna',       
                    scope:{
                        include:[
                            {  
                                relation:'takeover',       
                                scope:{fields: ['id', 'name']}      
                            },
                            {  
                                relation:'handover',       
                                scope:{fields: ['id', 'name']}      
                            }                        
                        ]                        
                    }      
                }
            ]
        }
    })
    .$promise
    .then(
    function (res) {      
       
        $scope.model = res;
        $scope.model.modified = new Date(); 
        
        // 기업공개
        if(null != res.ipo)
        {
	        $scope.model_ipo = res.ipo;

	        if(null != $scope.model_ipo.company){	        	
		        var companyName = $scope.model_ipo.company.name;
		        var companyId = $scope.model_ipo.company.id;
	        }

	        $scope.model_ipo.company = [];
	        if(null != $scope.model_ipo.companyId)
		    	$scope.model_ipo.company.push({name:companyName, id:companyId});        	
        }

		// 인수합병
		if(null != res.mna)
        {
			$scope.model_mna = res.mna;

	        $scope.model_mna.hands = [];
	        if(null != $scope.model_mna.handoverId)
		    	$scope.model_mna.hands.push({name:$scope.model_mna.handover.name, id:$scope.model_mna.handover.id});
		    
		    $scope.model_mna.takes = [];
		    if(null != $scope.model_mna.takeoverId)
		    	$scope.model_mna.takes.push({name:$scope.model_mna.takeover.name, id:$scope.model_mna.takeover.id});
		}

		// 투자유치
		if(null != res.investment)
		{
			$scope.model_investment = res.investment;
	        
	        $scope.model_investment.investees = [];
		    if(null != $scope.model_investment.investeeId)
		    	$scope.model_investment.investees.push({name:$scope.model_investment.investee.name, id:$scope.model_investment.investee.id});      
		    
		    $scope.model_investment.company = [];
		    if(null != $scope.model_investment.investorCompany && $scope.model_investment.investorCompany.length > 0)
		    	$scope.model_investment.company = $scope.model_investment.investorCompany.map(function(tag) { return {name:tag.name, id:tag.id}; });		    	
		    
		    $scope.model_investment.person = [];
		    if(null != $scope.model_investment.investorPerson && $scope.model_investment.investorPerson.length > 0)
		    	$scope.model_investment.person = $scope.model_investment.investorPerson.map(function(tag) { return {name:tag.name, id:tag.id}; });
		}
        
        // Setting tags  
        $scope.inserted_tag = $scope.model.field;        

        // news article
		$scope.newsCompany = [];
		if(null != res.newsCompany) $scope.newsCompany = res.newsCompany;		
		
		$scope.newsPerson = []; 
		if(null != res.newsPerson) $scope.newsPerson = res.newsPerson;

        /**
		 *  Setting timepicker  
		**/		
		var d = new Date($scope.model.datetime);

	    $scope.date = $scope.model.datetime;
	    $scope.time = d; 
		$scope.hstep = 1;
	  	$scope.mstep = 10;
    },
    function (err) {                            
        console.log('err', err);
        alert(err.data.error.message);
        $scope.cancel();
    });     

	/**
	 *  get person category item 
	**/
    $scope.getPersonCategory = function() {			       	
    	$scope.items_person = [];

    	Person
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
	$scope.save = function() {		

		// loading start
		bsLoadingOverlayService.start();
		
		// 시간 조합
		$scope.model.datetime = new Date($scope.model.datetime);
		$scope.model.datetime.setHours($scope.time.getHours());
		$scope.model.datetime.setMinutes($scope.time.getMinutes());
		
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
		}else{
			$scope.model.personIds = [];
			$scope.newsPerson = [];
		}


		// // product tag 생성
		// // 태그 변환(object -> array)
		if($scope.model.product.length > 0){
			$scope.model.productIds = $scope.model.product.map(function(tag) { return tag.id; });			
		}else{
			$scope.model.productIds =[];
		}

		// // comapny tag 생성
		// // 태그 변환(object -> array)
		if($scope.model.company.length > 0){			
			$scope.model.companyIds = $scope.model.company.map(function(tag) { return tag.id; });
			$scope.newsCompany = $scope.model.company.map(function(tag) { return {companyId:tag.id}; });
		}else{
			$scope.model.companyIds = [];
			$scope.newsCompany = [];
		}

		delete $scope.model.person;
		delete $scope.model.product;
		delete $scope.model.company;

		News
		.upsert($scope.model)
		.$promise
	    .then(
	    function (res) {               

	    	var newsId = $stateParams.id;

    		$scope.deleteRelationModel('newsCompany', 'destroyAll', newsId)	    			
	        .then(
	        function (res) {        			        	        	

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
	        });	

	    	
    		$scope.deleteRelationModel('newsPerson', 'destroyAll', newsId)	    			
	        .then(
	        function (res) {        		

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
	        });	

			
			// create relation model
	    	if($scope.model.type === '기업공개') //create IPO model
	    	{
	    		// set loading
	    		$scope.ipoLoading = true;

	    		if(null != $scope.model.ipo){
	    			// delete ipo relation
	    			$scope.deleteRelationModel('ipo', 'destroy', newsId)	    			
			        .then(
			        function (res) {        			            
			    		// insert ipo relation companyId
			    		if($scope.model_ipo.company.length > 0){
				    		$scope.model_ipo.companyId = $scope.model_ipo.company[0].id;
				    		// $scope.model_ipo.companyName = $scope.model_ipo.company[0].name;
			    		}else{
			    			delete $scope.model_ipo.companyId;
				    		// delete $scope.model_ipo.companyName;
			    		}

			    		delete $scope.model_ipo.company;	    		
			    		
			    		// 분야 태그 추가 
		    			$scope.model_ipo.field = $scope.model.field;
		    			$scope.model_ipo.link = $scope.model.link;
		    			$scope.model_ipo.title = $scope.model.title;
		    			
			    		// create models
			    		$scope.createRelationModel('ipo', 'create', newsId, $scope.model_ipo);		    	
			        });
	    		} 

	    	}
	    	else if($scope.model.type === '인수합병') //create MNA model
	    	{
	    		// set loading
	    		$scope.mnaLoading = true;

	    		if(null != $scope.model.mna)
	    		{	
	    			// delete mna relation
	    		 	$scope.deleteRelationModel('mna', 'destroy', newsId)
	    		 	.then(
			        function (res) {        			      
			        	

			    		// insert mna relation handover
			    		if($scope.model_mna.hands.length > 0){ 			
				    		$scope.model_mna.handoverId = $scope.model_mna.hands[0].id;
				    	}else{				    		
				    		delete $scope.model_mna.handoverId;				    		
				    	}

				    	// insert mna relation takesover
				    	if($scope.model_mna.takes.length > 0){
				    		$scope.model_mna.takeoverId = $scope.model_mna.takes[0].id;
				    	}else{
				    		delete $scope.model_mna.takeoverId;				    		
				    	}

			    		delete $scope.model_mna.hands;
			    		delete $scope.model_mna.takes;
			    		delete $scope.model_mna.handover;
			    		delete $scope.model_mna.takeover;

			    		// 분야 태그 추가 
	    				$scope.model_mna.field = $scope.model.field;
	    				$scope.model_mna.link = $scope.model.link;
	    				$scope.model_mna.title = $scope.model.title;

			    		// create models
			    		$scope.createRelationModel('mna', 'create', newsId, $scope.model_mna);		    	
			        });
	    		}

	    	}
	    	else if($scope.model.type === '투자유치') //create INVESTMENT model
	    	{
	    		// set loading
	    		$scope.investmentLoading = true;

	    		if(null != $scope.model.investment)
    		 	{
    		 		// delete investment relation
    		 		$scope.deleteRelationModel('investment', 'destroy', newsId)
    		 		.then(
			        function (res) {    

			    		// insert investment relation investee
			    		if(null !=  $scope.model_investment.investees[0]){
			    			delete $scope.model_investment.investeeId;
				    		$scope.model_investment.investeeId = $scope.model_investment.investees[0].id;
			    		}else{
			    			delete $scope.model_investment.investeeId;
				    		delete $scope.model_investment.investee;
			    		}	
			    		// insert investment relation company
			    		if($scope.model_investment.company.length > 0){
				    		$scope.model_investment.companyIds = $scope.model_investment.company.map(function(tag) { return tag.id; });
			    		}else{
				    		delete $scope.model_investment.companyIds
			    		}
			    		// insert investment relation person
			    		if($scope.model_investment.person.length > 0){			    		
			    			$scope.model_investment.personIds = $scope.model_investment.person.map(function(tag) { return tag.id; });
			    		}else{			    		
			    			delete $scope.model_investment.personIds
			    		}

			    		delete $scope.model_investment.investees;
			    		delete $scope.model_investment.company;
			    		delete $scope.model_investment.person;

			    		// 분야 태그 추가 
			    		$scope.model_investment.field = $scope.model.field;
			    		$scope.model_investment.link = $scope.model.link;
			    		$scope.model_investment.title = $scope.model.title;


			    		// create models
			    		$scope.createRelationModel('investment', 'create', newsId, $scope.model_investment);		    		    		
			        });
    		 	} 

	    	}

	    	// histroy back
			if($scope.checkLoading()) $scope.cancel();
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

	    	// histroy back
	    	if($scope.checkLoading()) $scope.cancel(); 
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
     *  delete relation model
    **/ 
    $scope.deleteRelationModel = function (name, action, id) {
        
        return $q(function(resolve, reject) {	    	
	    	News[name][action]
	        ({id: id})
	        .$promise
	        .then(
	        function (res) {        
	            resolve(res);
	        },
	        function (err) {                            
	            console.log('err', err);
	            alert(err.data.error.message);
	        });  	
	  	});    
    };

    /**
     *  cancel button
    **/ 
    $scope.cancel = function () {   
        // loading stop
        bsLoadingOverlayService.stop();

        // reload page
        // $window.history.back();
        $window.location = "/admin/news/list?page=" + $location.search().page;
    };

    /** 
     *	Datetimepicker Bindable functions
	**/
	$scope.$watch('model.datetime', function (newValue) {
	    if($scope.model) $scope.model.datetime = $filter('date')(newValue, 'yyyy-MM-dd'); // Or whatever format your real model should use
	});

	$scope.$watch('model_ipo.announcementDate', function (newValue) {
	    if($scope.model_ipo) $scope.model_ipo.announcementDate = $filter('date')(newValue, 'yyyy-MM-dd'); // Or whatever format your real model should use
	});

	$scope.$watch('model_mna.announcementDate', function (newValue) {
	    if($scope.model_mna) $scope.model_mna.announcementDate = $filter('date')(newValue, 'yyyy-MM-dd'); // Or whatever format your real model should use
	});

	$scope.$watch('model_investment.announcementDate', function (newValue) {
	    if($scope.model_investment) $scope.model_investment.announcementDate = $filter('date')(newValue, 'yyyy-MM-dd'); // Or whatever format your real model should use
	});

	
}]);