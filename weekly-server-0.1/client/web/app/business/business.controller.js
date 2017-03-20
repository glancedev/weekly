'use strict';

angular.module('testApp')
  .controller('BusinessCtrl', function ($rootScope, $scope, $state, $location, $window, $timeout, $log, $http,
                                     $localStorage, Business, Banner, timeFactory) {

    $rootScope.$state = $state;

    // 날짜;
    $scope.today = timeFactory.getToday();
    $scope.tomorrow = timeFactory.getTomorrow();
    
    // infinite value
    $scope.contents = [];
    
    
    $scope.filter = {
          filter:{
            include:[
              {
                relation:'organizations',    // 주관 회사/기관 리스트
                scope:{fields: ['id', 'name']}
              }
            ],
            where: { and: [
                {display: true},
                {or:[
                    {deadline: {gte: $scope.today}},
                    {deadline: null}
                 ]}
              ]
            },
            order: 'created DESC',
            limit: '30',
            skip: 0
          }
      };


    /**
     *   where 필터를 구한다.
     **/
    $scope.getFilter = function(index){           
        switch(index) {
            case 0:
                $scope.filter.filter.skip = 0;
                $scope.filter.filter.order = "created DESC";
                $scope.filter.filter.where = { and: [ {display: true},
                                                  {or:[
                                                      {deadline: {gte: $scope.today}},
                                                      {deadline: null}
                                                   ]}
                                                ]
                                              };
              break;

            case 1:
                $scope.filter.filter.skip = 0;
                $scope.filter.filter.order = "deadline ASC";
                $scope.filter.filter.where = {and: [ { display: true },
                                                  { ordinary: false },
                                                  {deadline: {gte: $scope.today}}              
                                              ]}; 
              break;            

            default:
                $scope.filter.filter.skip = 0;
                $scope.filter.filter.order = "created DESC";
                $scope.filter.filter.where = {and: [ { display: true },
                                                  { ordinary: true }    
                                              ]}; 
              break;
        };
    };  


    /**
     *  Business 리스트 가져오기
     **/
    $scope.loadMore = function(index){

        if(index != null){
          $scope.index = index;
          $scope.contents = [];
          $scope.getFilter(index);
        };

        Business
        .find($scope.filter)
        .$promise
        .then(
          function (res) {
            console.log(res);
            $scope.contents = $scope.contents.concat(res);

            if (res.length == 0) {
              $scope.infiniteBreak = true;
            } else {
              $scope.infiniteBreak = false;
            }
            $scope.filter.filter.skip += 30;
            console.log(res.length);
          },
          function (err) {
            console.log('err', err);
            alert(err.data.error.message);
          });

    };

    /**
     *  Banner 리스트 가져오기
     **/
    $scope.loadBanner = function(index) {

      Banner
        .find({
          filter: {
            include: ['file'],
            where: {
              and: [
                {display: true},
                {name: {like: 'business'}}
              ]
            },
            order: "start ASC"
          }
        })
        .$promise
        .then(
          function (res) {
            console.log('banner ', res);
            $scope.banners = [];
            $scope.banners = $scope.banners.concat(res);
          },
          function (err) {
            console.log('err', err);
            alert(err.data.error.message);
          });
    };

    $scope.loadBanner();    

    /* sidebar */
    $scope.sub_menu = [
      { title: '등록일순으로 정렬'},
      { title: '마감일순으로 정렬'},
      { title: '상시접수사업 보기'}
    ];

    $scope.checkboxModel = {
      value1 : '',
      value2 : ''
    };

  });

