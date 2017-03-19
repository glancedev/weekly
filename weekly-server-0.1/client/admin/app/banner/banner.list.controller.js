'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:BannerListCtrl
 * @description
 * # BannerListCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
.controller('BannerListCtrl', ['$scope', '$location', 'LoopBackAuth', 'ModalService', 'Banner', 'File', 'Container',
			function ($scope, $location, LoopBackAuth, ModalService, Banner, File, Container) {	
               
	/**
     *  List pagenation
    **/ 
    $scope.totalCount = 0;          
    $scope.pageSize = 15;

    $scope.pagination = {
        current: 1
    };

    $scope.filter = {
        filter:{           
            include:[
                {  
                    relation:'file',       
                    scope:{fields: ['container', 'id', 'alias']}      
                }
            ],  
            order: 'created DESC',
            limit: '15',
            skip: null,
        }
    };

    $scope.filter_count = {};

    $scope.pageChanged = function(newPage) {
        $scope.contents = [];  
        $scope.pagination.current = newPage;
        $scope.loadMore(newPage-1);
    };


    /**
     *  Banner List 
    **/
    $scope.reset = function(){        
        $scope.contents = [];    
        $scope.loadMore(0);
        $scope.getTotalCount();
    };

    $scope.getTotalCount = function(){     

        Banner
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

        Banner
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
    $scope.confirmDelete = function(index, id, file){      

        ModalService.showModal({
            templateUrl: "components/modal/confirm.html",
            controller: "ModalConfirmCtrl",        
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
                if(result) $scope.delete(index, id, file);
            });
        });
    };

    $scope.delete = function(index, id, file){     

        Banner
        .deleteById({
            id: id
        })
        .$promise
        .then(
        function (res) {               
            // delete thumbnail file
            if(null != file) $scope.deleteFile(file.id, file.container, file.alias);

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
     *  delete file
    **/ 
    $scope.deleteFile = function (id, container, file) {
    
        //detete Thumbnail file in database
        File
        .deleteById({            
            id: id
        })
        .$promise
        .then(
        function (res) {               
            //detete physical Thumbnail file 
            Container
            .removeFile({
                container: container,
                file: file 
            })
            .$promise
            .then(
            function (res) {        
                // delete $scope.model.file;
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
        Banner
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
