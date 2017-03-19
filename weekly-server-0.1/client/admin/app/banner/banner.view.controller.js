'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:BannerListCtrl
 * @description
 * # BannerListCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
.controller('BannerViewCtrl', ['$scope', '$stateParams', '$window', '$location', '$filter', 'LoopBackAuth', 'ModalService', 
    'Banner', 'File', 'FileUploader', 'Container', 'bsLoadingOverlayService',
			function ($scope, $stateParams, $window, $location, $filter, LoopBackAuth, ModalService, Banner, 
                File, FileUploader, Container, bsLoadingOverlayService) {	

	/**
     *  view baaner 
    **/ 
	$scope.model = [];

	Banner
    .findById({    	
    	id: $stateParams.id,    	
        filter: {            
            include:['file']
        }        
    })
    .$promise
    .then(
    function (res) {              
    	$scope.model = res;
    },
    function (err) {                            
        console.log('err', err);
        alert(err.data.error.message);
    });		

    /**
	 *  save changed  
	**/
	$scope.save = function () {

        bsLoadingOverlayService.start();
	
		Banner
        .upsert($scope.model)
        .$promise
        .then(
        function (res) { 

            // file upload
            if(uploader.queue.length > 0) $scope.upload_file(res.id);
            else $scope.cancel();                     
        },
        function (err) {                            
            console.log('err', err);
            alert(err.data.error.message);
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
            item.url = '/api/files/upload?bannerId=' + id        
        };

        uploader.uploadAll();     
    };

    uploader.onCompleteAll = function() {       
        $scope.cancel();
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
                delete $scope.model.file;
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
        $window.history.back();
    };


    /** 
     *  Datetimepicker Bindable functions
    **/
    $scope.endDateBeforeRender = endDateBeforeRender
    $scope.endDateOnSetTime = endDateOnSetTime
    $scope.startDateBeforeRender = startDateBeforeRender
    $scope.startDateOnSetTime = startDateOnSetTime

    $scope.$watch('model.start', function (newValue) {
        $scope.model.start = $filter('date')(newValue, 'yyyy-MM-dd HH:mm'); // Or whatever format your real model should use
    });

    $scope.$watch('model.end', function (newValue) {
        $scope.model.end = $filter('date')(newValue, 'yyyy-MM-dd HH:mm'); // Or whatever format your real model should use
    });
    
    function startDateOnSetTime () {
      $scope.$broadcast('start-date-changed');
    }

    function endDateOnSetTime () {
      $scope.$broadcast('end-date-changed');
    }

    function startDateBeforeRender ($dates) {
      if ($scope.model.end) {
        var activeDate = moment($scope.model.end);

        $dates.filter(function (date) {
          return date.localDateValue() >= activeDate.valueOf()
        }).forEach(function (date) {
          date.selectable = false;
        })
      }
    }

    function endDateBeforeRender ($view, $dates) {
      if ($scope.model.start) {
        var activeDate = moment($scope.model.start).subtract(1, $view).add(1, 'minute');

        $dates.filter(function (date) {
          return date.localDateValue() <= activeDate.valueOf()
        }).forEach(function (date) {
          date.selectable = false;
        })
      }
    }

}]);
