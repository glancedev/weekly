'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:CompanyViewCtrl
 * @description
 * # CompanyViewCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
.controller('CompanyViewCtrl', ['$scope', '$stateParams', '$window', '$http', '$location', '$filter', 'LoopBackAuth', 'ModalService', 
    'Category', 'Person', 'Company', 'Thumbnail', 'Container', 'Product', 'Incubation', 'FileUploader', 'bsLoadingOverlayService',
            function ($scope, $stateParams, $window, $http, $location, $filter, LoopBackAuth, ModalService, 
                Category, Person, Company, Thumbnail, Container, Product, Incubation, FileUploader, bsLoadingOverlayService) {    

    /**
     *  init model
    **/             
    
    // array product
    $scope.products = [];

    // array incubation
    $scope.incubations = [];

    $scope.actions = ['운영중', '상장', '피인수', '폐업'];   

    Company
    .findById({     
        id: $stateParams.id,     
        filter: {            
            include:[
                {relation:'thumbnail'},
                {relation:'file'},
                {relation:'product'},
                {relation:'founders'},
                {relation:'founderPrevs'},
                {  
                    relation:'incubation',       
                    scope:{
                        include:[
                            {  
                                relation:'companies',       
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
        
        // setting products array
        if(res.product.length !== 0) $scope.products = res.product;
        
        // setting products array        
        if(res.incubation.length !== 0) {
            
            $scope.incubations = res.incubation;
            
            angular.forEach($scope.incubations, function (item, i) {    
                item.company = [];

                angular.forEach(item.companies, function (value, i) {    
                    item.company.push({
                        id: value.id,
                        name: value.name
                    })                                                      
                })        
            });                                     
        }
        
        // Setting tags  
        $scope.inserted_tag = $scope.model.field;
    },
    function (err) {                            
        console.log('err', err);
        alert(err.data.error.message);
        $scope.cancel();
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
     *  get tag items
    **/
    $scope.loadItem = function(query, name) {

        var tags = $scope[name];

        // match word 
        return tags.filter(function(tags) {         
            return tags;
        });
    };  

   /**
     *  add Item     
    **/
    $scope.newItem = function (name) {
                    
        if(name == 'products')
        {
            $scope.products.push({
                name: null,
                nameEng: null,
                description: null,
                link: null
            });
        }
        else
        {           
            $scope.incubations.push({
                name: null,
                // incubatorName: $scope.model.name,
                number: null,
                deadline: null,
                year: null,
                company: null
            });
        }

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
     *  Company Save
    **/
    $scope.save = function() {            

        // loading start
        bsLoadingOverlayService.start();

        // 태그 변환(object -> array)       
        // 기타 검색 가능한 명칭 태그
        if(null != $scope.model.nameTag)  
            $scope.model.nameTag = $scope.model.nameTag.map(function(tag) { return tag.text; });

        // 설립자 id 태그
        if(null != $scope.model.founders)
            $scope.model.founderIds = $scope.model.founders.map(function(tag) { return tag.id; });

        // 설립자 이전회사 id 태그
        if(null != $scope.model.founderPrevs)
            $scope.model.founderPrevIds = $scope.model.founderPrevs.map(function(tag) { return tag.id; });

        // 출신 대학교 태그
        if(null != $scope.model.founderSchool)
            $scope.model.founderSchool = $scope.model.founderSchool.map(function(tag) { return tag.name; });

        // 태그 array 생성
        $scope.model.field = [];
        
        angular.forEach($scope.inserted_tag, function (values, i) {    
            
            if(!$scope.model.field.includes(values.name)) $scope.model.field.push(values.name);

            // 태그 대분류 item 주입
            angular.forEach(values.item, function (item, i) {    
                if(!$scope.model.field.includes(item)) $scope.model.field.push(item);
            });                                                                         
        });                        

        //보육 기업 수
        if($scope.incubations.length>0){
            $scope.model.countAc = 0;
            angular.forEach($scope.incubations, function (item, i) {    
                $scope.model.countAc += item.company.length;
            });                                                   
        };

        Company
        .upsert($scope.model)
        .$promise
        .then(
        function (res) {               
            
            var id = res.id;            

            // create relation model
            if($scope.model.type === '스타트업')
            {                        
                // delete products
                $scope.deleteModel('product', 'destroyAll', id)
                .then(function(res){

                    if($scope.products.length>0){

                        // insert product array
                        Company
                        .product
                        .createMany(
                            {id: id},
                            $scope.products
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

            }
            else if($scope.model.type === '보육기관')
            {

                // delete products
                $scope.deleteModel('incubation', 'destroyAll', id)
                .then(function(res){

                    if($scope.incubations.length>0){

                        // company id 태그
                        angular.forEach($scope.incubations, function (item, i) {    
                    
                            if(null != item.company)                    
                                item.companyIds = item.company.map(function(tag) { return tag.id; });                   
                                delete item.company;
                        });                                                   

                         // insert product array
                        Company
                        .incubation
                        .createMany(
                            {id: id},
                            $scope.incubations
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
            }                          

            // file upload
            if(uploader.queue.length > 0) $scope.upload_file(res.id);
            else 
            {
                if($scope.incubations.length === 0 && $scope.products.length === 0) $scope.cancel();
            }            

            // loading stop
            // bsLoadingOverlayService.stop();
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
        fn: function(item /*{Thumbnail|ThumbnailLikeObject}*/, options) {         
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            uploader.queue = [];
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    $scope.upload_file = function(id) {         
         
        uploader.onBeforeUploadItem = function(item) {
            item.url = '/api/thumbnails/upload?companyId=' + id      
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
            Company[model][action]({
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
        if($scope.model.type === '보육기관') $window.location = "/admin/company/list/ac?page=" + $location.search().page;
        else $window.location = "/admin/company/list/all?page=" + $location.search().page;
    };


    /** 
     *  watch exprience array user name 
    **/
    // $scope.$watch('model.name', function (newValue) {
    //     if($scope.incubations.length > 0){
    //         angular.forEach($scope.incubations, function(value){                                            
    //             value.incubatorName = newValue; // Or whatever format your real model should use                              
    //         });               
    //     } 
    // });

    /** 
     *  Datetimepicker Bindable functions
    **/
    $scope.$watch('model.foundationDate', function (newValue) {
        if($scope.model)  $scope.model.foundationDate = $filter('date')(newValue, 'yyyy-MM-dd'); // Or whatever format your real model should use
    });

    $scope.$watchCollection('incubations', function (newVal, oldVal) {
        angular.forEach($scope.incubations, function(value){    
            value.deadline = $filter('date')(value.deadline, 'yyyy-MM-dd'); // Or whatever format your real model should use              
        });       
    });

    $scope.baseValueChange = function(index, newValue) {
        $scope.incubations[index].deadline = $filter('date')(newValue, 'yyyy-MM-dd'); // Or whatever format your real model should use              
    }
    
}]);