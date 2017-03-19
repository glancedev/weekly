'use strict';

angular.module('testApp')
  .controller('PaymentCtrl', function ($scope, $http, Auth, User) {

    // sidebar
    $scope.sub_menu1 = [
      { title: '결제 내역', icon: '', link: 'payment.history' },
      { title: '결제 정보', icon: '', link: 'payment.info' }

    ];

    // main
    $scope.posts =
      [
        {
          userId: 1,
          reg_date: "2017-01-11",
          name: "PRO 멤버십",
          money: "99,000원",
          status: "승인됨"
        },
        {
          userId: 1,
          reg_date: "2016-12-11",
          name: "PRO 멤버십",
          money: "99,000원",
          status: "승인됨"
        },
      ];

  });
