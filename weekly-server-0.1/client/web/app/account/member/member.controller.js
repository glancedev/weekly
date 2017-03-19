'use strict';

angular.module('testApp')
  .controller('MemberCtrl', function ($scope, $http, $location, $localStorage, $window, User, Group, GroupMapping, LoopBackAuth) {


    /**
     *   유저 그룹 정보 가져오기
    **/
    User
    .findById({     
        id: LoopBackAuth.currentUserId,
        filter: {
            fields: ['userId'],
            include: {
                relation: 'group', scope: {}
            }
        }
    })
    .$promise
    .then(
    function (res) {                                 
      $scope.groupLimit = res.group.limit
    },
    function (err) {                            
        console.log('err', err);
        alert(err.data.error.message);
    });

    /**
     *  group member List 
    **/
    $scope.filter = {
        id: $localStorage.group.id,    // group 아이디
        filter:{               
            include: ["user"],   
            where:{
                principalType: "USER",
                available: null
            },
            order: 'principalId DESC',
            limit: '30',     // 조회 갯수
            skip: null
        }
    };

    $scope.contents = [];

    $scope.loadMore = function(){     

      if($location.path().includes('all')) $scope.filter.filter.where.available = true;
      if($location.path().includes('wait')) $scope.filter.filter.where.available = false;

      Group
      .members($scope.filter)
      .$promise
      .then(
      function (res) {  
          $scope.contents = $scope.contents.concat(res);   

          if (res.length == 0) {
            $scope.infiniteBreak = true;
          } else {
            $scope.infiniteBreak = false;
          }

          $scope.filter.filter.skip += 30;
      },
      function (err) {                
          console.log('err', err);
          alert(err.data.error.message);
      }); 
    };


    /**
     *   등록 승인, 취소 함수
    **/
    $scope.available = function(index, id, userId, available, email){         

        if(available && $scope.groupLimit <= $scope.count ){
          alert('승인 인원이 초과하였습니다.'); 
          return false;
        } 

        Group
        .permit({
            id: id, 
            userId: userId,
            available: available    
        })
        .$promise
        .then(
        function (res) {           
            // 이메일 발송
            if(available) $scope.sendEmail(email, 'confirm'); 
            $window.location.reload();

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

    /**
     *   승인, 대기 인원수 
    **/
    $scope.getCount = function(index, type){     
  
        if(type == null) return;

        Group
        .members
        .count({
            id: $localStorage.group.id,
            where:{
              principalType: "USER",
              available: type
            }
        })
        .$promise
        .then(
        function (res) {                                 
          $scope.sub_menu1[index].count = res.count;     
          if(type) $scope.count = res.count;
        },
        function (err) {                            
            console.log('err', err);
            alert(err.data.error.message);
        });
    };        

    // sidebar
    $scope.sub_menu1 = [
      { title: '등록된 구성원', icon: '', link: 'member.all', count: 0, type: true },
      { title: '승인 대기', icon: '', link: 'member.wait', count: 0, type: false },
      // { title: '승인 취소', icon: '', link: 'member.cancel', count: 23 },
      { title: '코드 관리', icon: '', link: 'member.code', count: '' }
    ];

    // 코드관리 페이지
    $scope.codeContent = {
      code: $localStorage.group.id,
      limit: $scope.groupLimit,
    };


  });
