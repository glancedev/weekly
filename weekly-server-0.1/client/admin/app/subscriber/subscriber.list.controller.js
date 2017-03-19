'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
.controller('SubscriberListCtrl', ['$scope', '$stateParams', '$location', 'User', 'LoopBackAuth', 'ModalService', 'bsLoadingOverlayService',
    'RoleMapping', 'Group', 'GroupMapping',
			function ($scope, $stateParams, $location, User, LoopBackAuth, ModalService, bsLoadingOverlayService,
                RoleMapping, Group, GroupMapping) {	

    /**
     *  List pagenation
    **/ 
    $scope.type = $stateParams.type;
    $scope.totalCount = 0;          
    $scope.pageSize = 15;

    $scope.pagination = {
        current: 1
    };

    $scope.filter = {
        filter:{    
            include:[
                {
                    relation : 'group',
                    scope: {include:['members']}
                },
                {
                    relation : 'roleMapping',
                    scope: {}
                },
                {
                    relation : 'groupMapping',
                    scope: {}
                }
            ],       
            where: {                
                and : [
                    {type: { neq:  'admin' }},
                    {leave: false},                
                ]                
            },   
            order: 'created DESC',
            limit: '15',
            skip: null,
        }
    };

    $scope.filter_count = {
        where: {                 
            and : [
                {type: { neq:  'admin' }},
                {leave: false},                
            ]
        }
    };

    
    if($stateParams.type == 'group')  // 단체 목록 일시
    {
        $scope.filter.filter.where = {type : 'group'};
        $scope.filter_count.where = {type : 'group'};
    }
    else if($stateParams.type == 'private')  // 개인 목록 일시
    {
        $scope.filter.filter.where = {type : 'private'};            
        $scope.filter_count.where = {type : 'private'};
    }
    else if($stateParams.type == 'block')  // 차단 목록 일시
    {
        $scope.filter.filter.where = {and : [{type: { neq:  'admin' }}, {available: false}]};
        $scope.filter_count.where = {and : [{type: { neq:  'admin' }}, {available: false}]};
    }
    else if($stateParams.type == 'leave')  // 차단 목록 일시
    {
        $scope.filter.filter.where = {leave : true};            
        $scope.filter_count.where = {leave : true};
    }


    $scope.pageChanged = function(newPage) {
        $scope.contents = [];  
        $scope.pagination.current = newPage;
        $scope.loadMore(newPage-1);
    };


    /**
     *  User List 
    **/
    $scope.reset = function(){        
        $scope.contents = [];    
        $scope.loadMore(0);
        $scope.getTotalCount();
    };

    $scope.getTotalCount = function(){     

        User
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

        User
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
                type: { neq:  'admin' },
                userId:{regexp: "/"+$scope.keyword+"/i"}
            }
        };     
        
        $scope.filter = {
            filter:{           
                order: 'created DESC',
                limit: '15',
                skip: null,
                where: {        
                    type: { neq:  'admin' },
                    userId:{regexp: "/"+$scope.keyword+"/i"}
                }
            }
        };

        $scope.reset()
    };


    /**
     *  User delete
    **/             
    $scope.confirmDelete = function(index, id, groupId, groupMappingId, roleMapping){      

        ModalService.showModal({
            templateUrl: "components/modal/confirm.html",
            controller: "ModalConfirmCtrl",        
        }).then(function(modal) {
            modal.element.modal();
            modal.close.then(function(result) {
                if(result) $scope.delete(index, id, groupId, groupMappingId, roleMapping);
            });
        });
    };

    $scope.delete = function(index, id, groupId, groupMappingId, roleMapping){      

        // loading start
        bsLoadingOverlayService.start();

        User
        .deleteById({
            id: id
        })
        .$promise
        .then(
        function (res) {
            // delete group mapping
            if(null != groupId) $scope.deleteGroup(groupId, groupMappingId, roleMapping);            
            else $scope.deleteGroupMapping(groupMappingId, roleMapping);            
        },
        function (err) {                            
            console.log('err', err);
            alert(err.data.error.message);

            // loading stop
            bsLoadingOverlayService.stop(); 
        });
    };   

    // delete group mapping
    $scope.deleteGroup = function(groupId, groupMappingId, roleMapping){          

        Group
        .deleteById({
            id: groupId
        })
        .$promise
        .then(
        function (res) {
            // delete role mapping
            $scope.deleteGroupMapping(groupMappingId, roleMapping);
        },
        function (err) {                            
            console.log('err', err);
            alert(err.data.error.message);

            // loading stop
            bsLoadingOverlayService.stop(); 
        });
    };   

    // delete group mapping
    $scope.deleteGroupMapping = function(groupMappingId, roleMapping){          

        GroupMapping
        .deleteById({
            id: groupMappingId
        })
        .$promise
        .then(
        function (res) {
            // delete role mapping
            if(null != roleMapping && roleMapping.length > 0){
                $scope.deleteRoleMapping(roleMapping);
            }else{
                $scope.totalCount -= 1;
                $scope.contents = [];  
                $scope.pageChanged($scope.pagination.current);   

                // loading stop
                bsLoadingOverlayService.stop();      
            }
        },
        function (err) {                            
            console.log('err', err);
            alert(err.data.error.message);

            // loading stop
            bsLoadingOverlayService.stop(); 
        });
    };   

    // delete role mapping
    $scope.deleteRoleMapping = function(roleMapping){    

        angular.forEach(roleMapping, function(value){                        
            RoleMapping
            .deleteById({
                id: value.id
            })
            .$promise
            .then(
            function (res) {
                $scope.totalCount -= 1;
                $scope.contents = [];  
                $scope.pageChanged($scope.pagination.current);        

                // loading stop
                bsLoadingOverlayService.stop(); 
            },
            function (err) {                            
                console.log('err', err);
                alert(err.data.error.message);

                // loading stop
                bsLoadingOverlayService.stop(); 
            });
        });       

    };   

    /**
     *  List attr update
    **/
    $scope.available = function(index, id, available, email){        
        User
        .patchAttributes({
            id: id,
            available: !available
        })
        .$promise
        .then(
        function (res) {      
            $scope.contents[index].display = !available;
            // block 일시 계정정지 이메일 발송
            if(!res.available) $scope.sendEmail(email, 'block'); 
        },
        function (err) {                            
            console.log('err', err);
            alert(err.data.error.message);
        });
    };

    /**
     *  Sned Email
    **/
    $scope.sendEmail = function(email, type){        
        User
        .email({
            email: email,
            type: type
        })
        .$promise
        .then(
        function (res) {                  
            console.log('res', res);
        },
        function (err) {                            
            console.log('err', err);
            alert(err.data.error.message);
        });
    };

	
}]);