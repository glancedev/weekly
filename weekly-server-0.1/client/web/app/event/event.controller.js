'use strict';

angular.module('testApp')
  .controller('EventCtrl', function ($rootScope, $scope, $state, $location, $window, $timeout, $log, $http,
                                       $localStorage, Event, Banner) {


    // infinite value
    $scope.contents = [];
    $scope.contents2 = [];
    // var skip = 0;

    $scope.filter = {
      filter:{
            where: { and: [
                {display: true},
                {datetime: {gte: new Date()}}
              ]
            },
            order: "datetime ASC",
            limit: 20,
            skip: 0
          }
    };
     

    /**
     *  Event 리스트 가져오기
     **/
    $scope.loadMore = function(index){

      if(index != null){
        $scope.index = index;      
        $scope.contents = [];
        $scope.contents2 = [];
        
        $scope.filter = {
            filter:{
                  where: $scope.getFilter(index),
                  order: "datetime ASC",
                  // limit: 20,
                  skip: 0
                }
          };        
      }

      Event
        .find($scope.filter)
        .$promise
        .then(
          function (res) {
            $scope.contents = $scope.contents.concat(res);

            var res2 = new Array;
            _.find(res, function(uniq) {
              res2.push(uniq.daybyday);
            });

            var uniq = res2.reduce(function(a,b){
              if (a.indexOf(b) < 0 ) a.push(b);
              return a;
            },[]);

            $scope.contents2 = $scope.contents2.concat(uniq);

            $scope.infiniteBreak = true;
            // if (res.length == 0) {
            //   $scope.infiniteBreak = true;
            // } else {
            //   $scope.infiniteBreak = false;
            // }
            // $scope.filter.filter.skip += 20;            
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
                {name: {like: 'event'}}
              ]
            },
            order: "start ASC"
          }
        })
        .$promise
        .then(
          function (res) {
            $scope.banners = [];
            $scope.banners = $scope.banners.concat(res);
          },
          function (err) {
            console.log('err', err);
            alert(err.data.error.message);
          });
    };

    $scope.loadBanner();

    var curr = new Date; // 지금 날짜
    var first = curr.getDate() - curr.getDay(); // 이번주 첫쨰 날

    var thisweek_f = new Date(curr.setDate(first)); // 이번주 마지막 날
    var thisweek_l = new Date(curr.setDate(first + 7)); // 이번주 마지막 날
    
    var nextweek_f = new Date(new Date().setDate(first + 8)); // 다음주 첫째 날
    var nextweek_l = new Date(new Date().setDate(first + 14)); // 다음주 마지막 날

    var afternext_f = new Date(new Date().setDate(first + 15)); // 다다음주 첫째날
    var afternext_l = new Date(new Date().setDate(first + 21)); // 다다음주 마지막 날

    var after_f = new Date(new Date().setDate(first + 22)); //다다음주 첫쨰날

    // $scope.title = '뉴스';
    moment.locale('ko');
    $scope.today = moment().format('MM/DD (dddd)');
    $scope.yesterday = moment().add(-1, 'days').format('MM/DD (dddd)');

    /**
     *   where 필터를 구한다.
     **/
    $scope.getFilter = function(index){           
        switch(index) {
            case 0:
                return {and: [
                      {display: true},
                      {datetime: {gte: moment(new Date()).format('YYYY-MM-DD 00:00:00')}}
                    ]
                  }
                break;

            case 1:
                return {and: [
                      {display: true},
                      {datetime: {gte: moment(new Date()).format('YYYY-MM-DD 00:00:00')}},
                      {datetime: {lte: moment(thisweek_l).format('YYYY-MM-DD')}}
                    ]
                  }
                break;
            
            case 2:
                return {and: [
                      {display: true},
                      {datetime: {gte: moment(nextweek_f).format('YYYY-MM-DD')}},
                      {datetime: {lte: moment(nextweek_l).format('YYYY-MM-DD')}}
                    ]
                  }
                break;

            case 3:              
              return {and: [
                    {display: true},
                    {datetime: {gte: moment(afternext_f).format('YYYY-MM-DD')}},
                    {datetime: {lte: moment(afternext_l).format('YYYY-MM-DD')}}
                  ]
                }
              break;

            default:
                return {and: [
                      {display: true},
                      {datetime: {gte: moment(after_f).format('YYYY-MM-DD')}},
                    ]
                  }                
                break;
          };
    };


    /**
     *  get count list
     **/
    $scope.getCountEvent = function(index){         

      Event
      .count({
        where:  $scope.getFilter(index)
      })
      .$promise
      .then(
        function (res) {          
          $scope.sub_menu[index].count = res.count;            
        },
        function (err) {
          console.log('err', err);
          alert(err.data.error.message);
        }); 
    };

    

    /* sidebar */
    $scope.sub_menu = [
      { title: '전체보기', count: 0 },
      { title: '이번 주', count: 0 },
      { title: '다음 주', count: 0 },
      { title: '다다음 주', count: 0 },
      { title: '추후 일정', count: 0 }
    ];

    $scope.checkboxModel = {
      value1 : '',
      value2 : ''
    };

    $scope.model = {
      name: 'Tabs'
    };
    $scope.sortType = 'name';
    $scope.sortReverse = false;
    $scope.searchContent = '';

    $scope.posts =
      [
        {
          userId: 1,
          time: "19:00",
          pay: "무료",
          name: "quia et suscipit so",
          location: "서울시 강남구 역삼동 645-27번지"
        },
        {
          userId: 1,
          time: "19:00",
          pay: "무료",
          name: "quia et suscipit",
          location: "서울시 강남구 선릉동 1234-123"
        }
      ];

    $scope.days =
      [
        {
          userId: 1,
          day: "10월 28일 (월)",
        },
        {
          userId: 2,
          day: "10월 29일 (화)"
        }
      ];

});



