'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:NewsListCtrl
 * @description
 * # NewsListCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
.controller('NewsListCtrl', ['$scope', '$stateParams', '$window', '$location', 'LoopBackAuth', 'ModalService', 'News',
			function ($scope, $stateParams, $window, $location, LoopBackAuth, ModalService, News) {	
	
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
            include: [
                {relation: "newsCompany", scope: {fields:{id:true}}},
                {relation: "newsPerson", scope: {fields:{id:true}}},
                {relation: "ipo", scope: {fields:{id:true}}},
                {relation: "mna", scope: {fields:{id:true}}},
                {relation: "investment", scope: {fields:{id:true}}}
            ],
            order: 'datetime DESC',
            limit: '15',
            skip: null
        }
    };

    $scope.filter_count = {};

    $scope.pageChanged = function(newPage) {
        // $scope.contents = [];  
        // $scope.pagination.current = newPage;
        // $scope.loadMore(newPage-1);
        $window.location = "/admin/news/list?page=" + newPage;
    };


    /**
     *  News List 
    **/
    $scope.reset = function(){        
        $scope.contents = [];    
        $scope.getTotalCount();
        
        var page = 0;
        if($location.search().page) page = $location.search().page -1;        

        $scope.loadMore(page);
    };

    $scope.getTotalCount = function(){     

        News
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

        News
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
                title:{regexp: "/"+$scope.keyword+"/i"}
            }
        };     
        
        $scope.filter = {
            filter:{           
                order: 'created DESC',
                limit: '15',
                skip: null,
                where: {                            
                    title:{regexp: "/"+$scope.keyword+"/i"}
                }
            }
        };

        $scope.reset()
    };


    /**
     *  News delete
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
        
        // delete relation model
        if($scope.contents[index].newsCompany.length > 0) $scope.deleteRelationModel('newsCompany', 'destroyAll', id);
        if($scope.contents[index].newsPerson.length > 0) $scope.deleteRelationModel('newsPerson', 'destroyAll', id);
        if(null != $scope.contents[index].ipo) $scope.deleteRelationModel('ipo', 'destroy', id);
        if(null != $scope.contents[index].mna) $scope.deleteRelationModel('mna', 'destroy', id);
        if(null != $scope.contents[index].investment) $scope.deleteRelationModel('investment', 'destroy', id);

        News
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
     *  delete relation model
    **/ 
    $scope.deleteRelationModel = function (name, action, id) {
            
        News[name][action]
        ({id: id})
        .$promise
        .then(
        function (res) {        
            
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
        News
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
