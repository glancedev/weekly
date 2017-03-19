'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:PersonListCtrl
 * @description
 * # PersonListCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
.controller('PersonViewCtrl', ['$scope', '$stateParams', '$window', '$location', '$filter', 'LoopBackAuth', 'ModalService', 'Category', 
        'Person', 'Company', 'Thumbnail', 'Container', 'FileUploader', 'bsLoadingOverlayService',
            function ($scope, $stateParams, $window, $location, $filter, LoopBackAuth, ModalService, Category, 
                Person, Company, Thumbnail, Container, FileUploader, bsLoadingOverlayService) {   
    /**
     *  init model
    **/

    // array education
    $scope.educations = [];

    // array experience
    $scope.experiences = [];

	Person
    .findById({    	
    	id: $stateParams.id,
        filter: {
            include:[
                {relation:'thumbnail'},
                {relation:'file'},
                {  
                    relation:'employee',       
                    scope:{
                        include:[
                            {  
                                relation:'company',       
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

        // setting experiences array
        if(res.employee.length !== 0) {

            $scope.experiences = res.employee

            angular.forEach($scope.experiences, function(value){    

                var companyId = value.companyId;
                var companyName = value.company.name;

                value.company = [];
                value.company.push({id:companyId, name:companyName});
            });       

        }

        // setting educations array    
        if(res.education.length !== 0) $scope.educations = res.education    

        // Setting tags  
        $scope.inserted_tag = $scope.model.field;
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
     *  Person Save
    **/
    $scope.save = function() {            

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
        $scope.model.company = [];

        angular.forEach($scope.experiences, function (value, i) {                

            value.companyId = value.company[0].id; 

            //model company 정보 추가 (이전 직장 검색 용도)
            $scope.model.company.push(value.companyId);

            delete value.company;
        });     

        // 학력 정보 추가
        if($scope.educations.length > 0) $scope.model.education = $scope.educations;

        Person
        .upsert($scope.model)
        .$promise
        .then(
        function (res) {     

            var id = res.id;      

            // create employee model
            $scope.deleteModel('employee', 'destroyAll', id)
            .then(function(res){

                if($scope.experiences.length>0){

                    // insert experiences array
                    Person
                    .employee
                    .createMany(
                        {id: id},
                        $scope.experiences
                    )
                    .$promise
                    .then(
                    function (res) {
                        $scope.cancel();
                    },
                    function (err) {                            
                        console.log('err', err);
                        alert(err.data.error.message);
                        bsLoadingOverlayService.stop();
                    });

                }else{
                    $scope.cancel();
                }
            });

            // file upload
            if(uploader.queue.length > 0) $scope.upload_file(res.id);
            else 
            {
                if($scope.experiences.length === 0) $scope.cancel();
            }

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
        // loading stop
        bsLoadingOverlayService.stop();

        // reload page
        // $window.history.back();
    };

    /**
     *  deleteModel
    **/
    $scope.deleteModel = function(model, action, id) {                
        return new Promise(function(resolve, reject){            
            Person[model][action]({
                id: id
            })
            .$promise
            .then(
            function (res) {
                return resolve(res);            
            },
            function (err) {                            
                console.log('err', err);
                alert(err.data.error.message);
                bsLoadingOverlayService.stop();
            });             
        });
    };

    /**
     *  delete Thumbnail file
    **/ 
    $scope.deleteThumbnail = function (id, container) {
    
        //detete Thumbnail file in database
        Thumbnail
        .deleteById({            
            id: id
        })
        .$promise
        .then(
        function (res) {               
            //detete physical Thumbnail file 
            Container
            .destroyContainer({
                container: container
            })
            .$promise
            .then(
            function (res) {        
                delete $scope.model.thumbnail;
            },
            function (err) {                            
                console.log('err', err);
                alert(err.data.error.message);
            });            
            
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
        // $window.history.back();
        $window.location = "/admin/person/list?page=" + $location.search().page;
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
     *  Datetimepicker Bindable functions
    **/
    $scope.$watch('model.birth', function (newValue) {
        if($scope.model) $scope.model.birth = $filter('date')(newValue, 'yyyy-MM-dd'); // Or whatever format your real model should use
    });

    $scope.$watchCollection('experiences', function (newVal, oldVal) {
        angular.forEach($scope.experiences, function(value){                
            value.dateFrom = $filter('date')(value.dateFrom, 'yyyy-MM-dd'); // Or whatever format your real model should use              
            value.dateTo = $filter('date')(value.dateTo, 'yyyy-MM-dd'); // Or whatever format your real model should use              
        });       
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