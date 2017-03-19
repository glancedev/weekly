'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:PersonListCtrl
 * @description
 * # PersonListCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
.controller('PersonListCtrl', ['$scope', '$window', '$location', 'LoopBackAuth', 'ModalService', 'Person', 'Thumbnail', 'Container',
			function ($scope, $window, $location, LoopBackAuth, ModalService, Person, Thumbnail, Container) {	
				
 	/**
     *  List pagenation
    **/ 
    $scope.totalCount = 0;          
    $scope.pageSize = 15;

    $scope.pagination = {
        current: $location.search().page || 1
    };

    $scope.filter = {
        filter:{        
            fields:["id", "userId", "type", "display", "name"],
            include:[
                {  
                    relation:'thumbnail',       
                    scope:{fields: ['container', 'id']}      
                },
                {  
                    relation:'employee',       
                    scope:{
                        include:[
                            {  
                                relation:'company',       
                                scope:{fields: ['id', 'name']}      
                            }                        
                        ],
                        fields: ['employeeName', 'companyName', 'companyId', 'position', 'current']
                    }      
                }
            ],  
            order: 'created DESC',
            limit: '15',
            skip: null,
        }
    };

    $scope.filter_count = {};

    $scope.pageChanged = function(newPage) {        
        $window.location = "/admin/person/list?page=" + newPage;
    };


    /**
     *  Person List 
    **/
    $scope.reset = function(){        
        $scope.contents = [];    
        $scope.getTotalCount();
        
        var page = 0;
        if($location.search().page) page = $location.search().page -1;        

        $scope.loadMore(page);
    };

    $scope.getTotalCount = function(){     

        Person
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

        Person
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
                    },
                    {  
                        relation:'employee',       
                        scope:{fields: ['employeeName', 'companyName', 'companyId', 'position', 'current']}      
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

        $scope.reset()
    };


    /**
     *  List delete
    **/                
    $scope.confirmDelete = function(index, id, thumbnail){      

        ModalService.showModal({
            templateUrl: "components/modal/confirm.html",
            controller: "ModalConfirmCtrl",        
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
                if(result) $scope.delete(index, id, thumbnail);
            });
        });
    };

    $scope.delete = function(index, id, thumbnail){     

        // delete employee 
        Person
        .employee
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

        // delete content
        Person
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
        Person
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
}]);
