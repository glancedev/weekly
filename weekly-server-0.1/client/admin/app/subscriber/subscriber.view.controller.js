'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:Subscriber
 * @description
 * # Subscriber
 * Controller of the adminApp
 */
angular.module('adminApp')
.controller('SubscriberViewCtrl', ['$scope', '$state', '$stateParams', '$filter', '$location', '$window', 'User', 'RoleMapping', 'Group', 'GroupMapping',
    'LoopBackAuth', 'bsLoadingOverlayService', 'ModalService',
			function ($scope, $state, $stateParams, $filter, $location, $window, User, RoleMapping, Group, GroupMapping,
                LoopBackAuth, bsLoadingOverlayService, ModalService) {	

    /**
     *  List pagenation
    **/ 
    $scope.type = $stateParams.type;
    $scope.totalCount = 0;          
    $scope.pageSize = 15;

    $scope.pagination = {
        current: 1
    };


    /**
     *  group member List 
    **/
    $scope.filter = {
        id: null,
        filter:{   
            include: {
                relation: "members", 
                scope: {
                    fields: ["id", "available", "principalId"],
                    include: {
                        relation : 'user',
                        scope: {
                            include: {
                                relation : 'roleMapping',
                                scope: {}
                            }
                        }
                    },
                    where:{
                        principalType: "USER"
                    },
                    order: 'principalId DESC',
                    limit: '15',
                    skip: null
                }
            }
        }
    };


    $scope.pageChanged = function(newPage) {
        $scope.contents = [];  
        $scope.pagination.current = newPage;
        $scope.loadMore(newPage-1);
    };

    $scope.reset = function(){        
        $scope.contents = [];    
        $scope.loadMore(0);
        $scope.getTotalCount();
        $scope.getTotalPermitCount();
    };

    $scope.getTotalCount = function(){     

        Group
        .members
        .count({
            id: $scope.group.id
        })
        .$promise
        .then(
        function (res) {                       
            $scope.totalCount = res.count - 1;
        },
        function (err) {                            
            console.log('err', err);
            alert(err.data.error.message);
        });
    };        

    $scope.getTotalPermitCount = function(){     

        Group
        .members
        .count({
            id: $scope.group.id,
            where: {
                available: true
            }
        })
        .$promise
        .then(
        function (res) {                       
            $scope.totalPermitCount = res.count - 1;
        },
        function (err) {                            
            console.log('err', err);
            alert(err.data.error.message);
        });
    };   

    $scope.loadMore = function(newPage){     
        
        $scope.filter.filter.include.scope.skip = newPage * $scope.pageSize;

        Group
        .findById($scope.filter)
        .$promise
        .then(
        function (res) {         
            if(null != res.members)
                $scope.contents = $scope.contents.concat(res.members);                         
        },
        function (err) {                
            console.log('err', err);
            alert(err.data.error.message);
        });        
    };       


    /**
     *  get user detail
    **/
    User
    .findById({     
        id: $stateParams.id,     
        filter: {
            include: {
                relation: 'group', scope: {}
            }
        }
    })
    .$promise
    .then(
    function (res) {      

        $scope.model = res;           

        if($scope.type != 'member'){

            $scope.group = res.group; 
            $scope.limit = $scope.group.limit
            delete $scope.model.group;
        }
        
        $scope.model.modified = new Date();

        /**
         *  get group member List 
        **/
        if($stateParams.type === 'group'){
            $scope.filter.id = $scope.group.id;
            $scope.reset();
        } 
    },
    function (err) {                            
        console.log('err', err);
        alert(err.data.error.message);
        $scope.cancel();
    });         



    /**
     *  update model
    **/
	$scope.save = function() {

        // loading start
        bsLoadingOverlayService.start();

		User
		.patchAttributes(
			{id: $stateParams.id},
			$scope.model
		)
		.$promise
	    .then(
	    function (res) {               

            if($scope.type != 'member'){

    	    	User
    	    	.group
    	    	.update(
    	    		{id: res.userId},
    	    		$scope.group
    	    	)
    			.$promise
    		    .then(
    		    function (res) {              
    		        $scope.cancel();
    		    },
    		    function (err) {                            
    		        console.log('err', err);
    	            alert(err.data.error.message);
                    // loading stop
                    bsLoadingOverlayService.stop();
    		    });
            }
            else{
                $scope.cancel();
            } 

	    },
	    function (err) {                            
	        console.log('err', err);
            alert(err.data.error.message);
            // loading stop
            bsLoadingOverlayService.stop();
	    });

    };


    /**
     *  enroll button
    **/ 
    $scope.enrollMember = function () {
        $state.go(
            'subscriber/create/:type',
            { type:'member', code:$scope.group.id, dueDate:$scope.group.dueDate, company:$scope.model.company }             
        );
    };

    /**
     *  List attr update
    **/
    $scope.available = function(index, id, userId, available){         

        // loading start
        bsLoadingOverlayService.start(); 
        
        Group
        .permit({
            id: id, 
            userId: userId,
            available: !available    
        })
        .$promise
        .then(
        function (res) {           
            $scope.contents[index].available = !available;                   

            if(!available) $scope.totalPermitCount = $scope.totalPermitCount + 1;
            else $scope.totalPermitCount = $scope.totalPermitCount - 1;

            // loading start
            bsLoadingOverlayService.stop();
        },
        function (err) {                
            console.log('err', err);
            alert(err.data.error.message);
            // loading start
            bsLoadingOverlayService.stop();
        });        
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
            // if(null != roleMapping && roleMapping.length > 0){
            //     $scope.deleteRoleMapping(roleMapping);
            // }else{
                $scope.totalCount -= 1;
                $scope.contents = [];  
                $scope.pageChanged($scope.pagination.current);       

                // loading stop
                bsLoadingOverlayService.stop(); 
            // }
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
     *  cancel button
    **/ 
    $scope.cancel = function () {   
        // loading stop
        bsLoadingOverlayService.stop();

        // reload page
        $window.history.back();
    };


    /** 
     *  Datetimepicker Bindable functions
    **/
    $scope.$watch('group.limit', function (newValue) {

        if(null != newValue && null != $scope.contents && $scope.contents.length > newValue){
            $scope.group.limit = $scope.limit;
        } 
        
    });

    $scope.$watch('group.dueDate', function (newValue) {
        if(null != $scope.group) $scope.group.dueDate = $filter('date')(newValue, 'yyyy-MM-dd'); // Or whatever format your real model should use
    });
	

}]);