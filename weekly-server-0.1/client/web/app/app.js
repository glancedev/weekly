'use strict';

angular.module('testApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ngAnimate',
  'ngSanitize',
  'infinite-scroll',
  'ui.bootstrap',
  'ui.select',
  'ngStorage',
  'angular-slidezilla',
  'lbServices',
  'validation.match'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, uiSelectConfig) {
    $urlRouterProvider
      .otherwise('/news');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');

	uiSelectConfig.theme = 'bootstrap';
	// uiSelectConfig.resetSearchInput = true;
	// uiSelectConfig.appendToBody = true;
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookies, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookies.get('token')) {
          config.headers.Authorization = $cookies.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookies.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $state, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      // set language
      moment.locale('ko');

        if (next.authenticate && !Auth.isLoggedIn()) {
          console.log('login!!!!!!');
          event.preventDefault();
          // $location.path('/login');
          // $state.transitionTo("login");
        }

      // Auth.isLoggedInAsync(function(loggedIn) {
	  //
      //   if (next.authenticate && !loggedIn) {
      //     console.log('login!!!!!!');
      //     event.preventDefault();
      //     // $location.path('/login');
      //     $state.transitionTo("login");
      //   }
      // });
    });
  })

;
