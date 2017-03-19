'use strict';

angular.module('testApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .state('signup_done', {
        url: '/signup_done',
        templateUrl: 'app/account/signup/signup_done.html',
        controller: 'SignupCtrl'
      })
      .state('proup', {
        url: '/proup',
        templateUrl: 'app/account/proup/proup.html',
        controller: 'ProupCtrl'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'app/account/profile/profile.html',
        controller: 'ProfileCtrl'
      })
      .state('profile_out', {
        url: '/profile_out',
        templateUrl: 'app/account/profile/profile_out.html',
        controller: 'ProfileCtrl'
      })
      .state('password_change', {
        url: '/password_change/:user_id/:access_token',        
        templateUrl: 'app/account/settings/password_change.html',
        controller: 'SettingsCtrl'
      })
      .state('password_change_done', {
        url: '/password_change_done',
        templateUrl: 'app/account/settings/password_change_done.html',
        controller: 'SettingsCtrl'
      })
      .state('password_recovery', {
        url: '/password_recovery',
        templateUrl: 'app/account/settings/password_recovery.html',
        controller: 'SettingsCtrl'
      })
      .state('password_sended', {
        url: '/password_sended/:email',
        templateUrl: 'app/account/settings/password_sended.html',
        controller: 'SettingsCtrl'
      })
      .state('member', {
        url: '/member',
        templateUrl: 'app/account/member/member.html',
        controller: 'MemberCtrl'
      })
      .state('member.all', {
        url: '/all',
        templateUrl: 'app/account/member/member_all.html',
        controller: 'MemberCtrl'
      })
      .state('member.wait', {
        url: '/wait',
        templateUrl: 'app/account/member/member_wait.html',
        controller: 'MemberCtrl'
      })
      .state('member.cancel', {
        url: '/cancel',
        templateUrl: 'app/account/member/member_cancel.html',
        controller: 'MemberCtrl'
      })
      .state('member.code', {
        url: '/code',
        templateUrl: 'app/account/member/member_code.html',
        controller: 'MemberCtrl'
      })
      .state('payment', {
        url: '/payment',
        templateUrl: 'app/account/payment/payment.html',
        controller: 'PaymentCtrl'
      })
      .state('payment.info', {
        url: '/info',
        templateUrl: 'app/account/payment/payment_info.html',
        controller: 'PaymentCtrl'
      })
      .state('payment.history', {
        url: '/history',
        templateUrl: 'app/account/payment/payment_history.html',
        controller: 'PaymentCtrl'
      })
    ;
  });