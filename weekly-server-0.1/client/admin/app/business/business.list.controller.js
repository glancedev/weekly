'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:BusinessListCtrl
 * @description
 * # BusinessListCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
.controller('BusinessListCtrl', ['$scope', '$stateParams', '$location', 'LoopBackAuth', 'ModalService', 'Business',
			function ($scope, $stateParams, $location, LoopBackAuth, ModalService, Business) {	
    
	/**
     *  List pagenation
    **/ 
    $scope.active = $stateParams.active;
    $scope.totalCount = 0;          
    $scope.pageSize = 15;

    $scope.pagination = {
        current: 1
    };

    $scope.filter = {
        filter:{     
            include:[
                {  
                    relation:'organizations',       
                    scope:{fields: ['id', 'name']}      
                }
            ],  
            where:{
                display: $stateParams.active
            },
            order: 'created DESC',
            limit: '15',
            skip: null
        }
    };

    $scope.filter_count = {
        where:{
            display: $stateParams.active
        }
    };


    $scope.pageChanged = function(newPage) {
        $scope.contents = [];  
        $scope.pagination.current = newPage;
        $scope.loadMore(newPage-1);
    };


    /**
     *  Business List 
    **/
    $scope.reset = function(){        
        $scope.contents = [];    
        $scope.loadMore(0);
        $scope.getTotalCount();
    };

    $scope.getTotalCount = function(){     

        Business
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

        Business
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
                title:{regexp: "/"+$scope.keyword+"/i"},
                display: $stateParams.active
            }
        };     
        
        $scope.filter = {
            filter:{           
                order: 'created DESC',
                limit: '15',
                skip: null,
                where: {                            
                    title:{regexp: "/"+$scope.keyword+"/i"},
                    display: $stateParams.active
                }
            }
        };

        $scope.reset()
    };


    /**
     *  Business delete
    **/             
    $scope.confirmDelete = function(index, id){      

        ModalService.showModal({
            templateUrl: "components/modal/confirm.html",
            controller: "ModalConfirmCtrl",        
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
                if(result) $scope.delete(index, id);
            });
        });
    };

    $scope.delete = function(index, id){      
        Business
        .deleteById({
            id: id
        })
        .$promise
        .then(
        function (res) {               
            $scope.totalCount -= 1;
            $scope.contents = [];  
            $scope.pageChanged($scope.pagination.current);        
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
        Business
        .patchAttributes({
            id: id,
            display: !display
        })
        .$promise
        .then(
        function (res) {      
            $scope.contents[index].display = !display;                   
        },
        function (err) {                            
            console.log('err', err);
            alert(err.data.error.message);
        });
    };

}]);
