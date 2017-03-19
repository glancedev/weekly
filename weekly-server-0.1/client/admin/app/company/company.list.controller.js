'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:CompanyListCtrl
 * @description
 * # CompanyListCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
.controller('CompanyListCtrl', ['$scope', '$window', '$filter', '$stateParams', '$location', 'LoopBackAuth', 'ModalService', 'Company', 'Thumbnail', 'Container',
            function ($scope, $window, $filter, $stateParams, $location, LoopBackAuth, ModalService, Company, Thumbnail, Container) {   

    /**
     *  List pagenation
    **/ 
    $scope.today = $filter('date')(new Date(), 'yyyy-MM-dd');
    $scope.type = $stateParams.type;

    $scope.totalCount = 0;          
    $scope.pageSize = 15;

    $scope.pagination = {
        current: $location.search().page || 1
    };

    $scope.filter = {
        filter:{        
            fields:["id", "userId", "type", "name"],
            include:[
                {  
                    relation:'thumbnail',       
                    scope:{fields: ['container', 'id']}      
                }
            ],  
            order: 'created DESC',
            limit: '15',
            skip: null,
        }
    };

    $scope.filter_count = {};
    
    if($stateParams.type == 'ac'){
        $scope.filter.filter.fields.push('isRecruiting');
        $scope.filter.filter.include.push({  
            relation:'incubation',       
            scope:{fields: ['id', 'deadline', 'companyIds'], order: 'deadline DESC'}      
        });
        $scope.filter.filter.where = {type: '보육기관'};        
        $scope.filter_count.where = {type: '보육기관'};        
    } 

    $scope.pageChanged = function(newPage) {
        if($stateParams.type == 'ac') $window.location = "/admin/company/list/ac?page=" + newPage;
        else $window.location = "/admin/company/list/all?page=" + newPage;
    };


    /**
     *  Company List 
    **/
    $scope.reset = function(){        
        $scope.contents = [];    
        $scope.getTotalCount();
        
        var page = 0;
        if($location.search().page) page = $location.search().page -1;        

        $scope.loadMore(page);
    };

    $scope.getTotalCount = function(){     

        Company
        .count($scope.filter_count)
        .$promise
        .then(
        function (res) {               
            $scope.totalCount = res.count;
        },
        function (err) {                            
            console.log('err', err);
            alert(err.data.error.message);
        });
    };        

    $scope.loadMore = function(newPage){     

        $scope.filter.filter.skip = newPage * $scope.pageSize;

        Company
        .find($scope.filter)
        .$promise
        .then(
        function (res) {        
            $scope.contents = $scope.contents.concat(res); 
        },
        function (err) {                
            console.log('err', err);
            alert(err.data.error.message);
        });        
    };   


    /**
     *  Init
    **/
    $scope.reset();
    

    /**
     *  search
    **/
    $scope.search = function(){ 

        $scope.filter_count = {
            where: {                            
                name:{regexp: "/"+$scope.keyword+"/i"}
            }
        };     
        
        $scope.filter = {
            filter:{      
                fields:["id", "userId", "type", "display", "name"],
                include:[
                    {  
                        relation:'thumbnail',       
                        scope:{fields: ['container', 'id']}      
                    }
                ],  
                order: 'created DESC',
                limit: '15',
                skip: null,
                where: {                            
                    name:{regexp: "/"+$scope.keyword+"/i"}
                }
            }
        };

        if($stateParams.type == 'ac'){
            $scope.filter.filter.fields.push('isRecruiting');
            $scope.filter.filter.include.push({  
                relation:'incubation',       
                scope:{fields: ['id', 'deadline'], order: 'deadline DESC'}      
            });
            $scope.filter.filter.where.type = '보육기관';        
            $scope.filter_count.where.type = '보육기관';
        } 

        $scope.reset()
    };


    /**
     *  List delete
    **/                
    $scope.confirmDelete = function(index, id, type, file){      

        ModalService.showModal({
            templateUrl: "components/modal/confirm.html",
            controller: "ModalConfirmCtrl",        
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
                if(result) $scope.delete(index, id, type, file);
            });
        });
    };

    $scope.delete = function(index, id, type, thumbnail){     

        // delete products
        if(type === '스타트업'){
            // delete products
            Company
            .product
            .destroyAll({
                id: id
            })
            .$promise
            .then(
            function (res) {},
            function (err) {                            
                console.log('err', err);
                alert(err.data.error.message);
            });
        }

        // delete incubations
        if(type === '보육기관'){
            Company
            .incubation
            .destroyAll({
                id: id
            })
            .$promise
            .then(
            function (res) {},
            function (err) {                            
                console.log('err', err);
                alert(err.data.error.message);
            });
        }

        // delete content
        Company
        .deleteById({
            id: id
        })
        .$promise
        .then(
        function (res) {               
            $scope.totalCount -= 1;
            $scope.contents = [];  
            $scope.pageChanged($scope.pagination.current); 

            // delete thumbnail file
            if(null != thumbnail) $scope.deleteThumbnail(thumbnail.id, thumbnail.container);
        },
        function (err) {                            
            console.log('err', err);
            alert(err.data.error.message);
        });
    }; 


    /**
     *  delete thumbnail file
    **/ 
    $scope.deleteThumbnail = function (id, container) {
    
        //detete file in database
        Thumbnail
        .deleteById({            
            id: id
        })
        .$promise
        .then(
        function (res) {        
            
            //detete physical file 
            Container
            .destroyContainer({
                container: container
            })
            .$promise
            .then(
            function (res) {
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
     *  List attr update
    **/
    $scope.display = function(index, id, display){        
        Company
        .patchAttributes({
            id: id,
            displayHot: !display
        })
        .$promise
        .then(
        function (res) {      
            $scope.contents[index].displayHot = !display;                   
        },
        function (err) {                            
            console.log('err', err);
            alert(err.data.error.message);
        });
    }; 

    $scope.recruiting = function(index, id, isRecruiting){        
        Company
        .patchAttributes({
            id: id,
            isRecruiting: !isRecruiting
        })
        .$promise
        .then(
        function (res) {      
            $scope.contents[index].isRecruiting = !isRecruiting; 
        },
        function (err) {                            
            console.log('err', err);
            alert(err.data.error.message);
        });
    }; 
}]);
