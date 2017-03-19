'use strict';

angular.module('testApp')
  .factory('Auth', function ($location, $rootScope, $http, User, $cookies, $q, LoopBackAuth) {
    var currentUser = {};
    // if($cookies.get('token')) {
    //   var userId = $cookies.get('userId');
    //   currentUser = User.get({id: userId});
    //   console.log(currentUser);
    // }

    if(LoopBackAuth.accessTokenId !== null) {

      User.getCurrent({
        id: LoopBackAuth.currentUserId
      },
      function (user) {
        currentUser = user;
      },
      function (err) {
                      
      });

    }

    return {

      // /**
      //  * Authenticate user and save token
      //  *
      //  * @param  {Object}   user     - login info
      //  * @param  {Function} callback - optional
      //  * @return {Promise}
      //  */
      // login: function(user, callback) {
      //   var cb = callback || angular.noop;
      //   var deferred = $q.defer();
	  //
      //   console.log(user);
      //   $http.post('/api/users/login?include=user', {
      //     userId: user.userId,
      //     password: user.password
      //   }).
      //   success(function(data) {
      //     console.log(data.id);
      //     $cookies.put('token', data.id);
      //     $cookies.put('userId', data.userId);
      //     currentUser = User.get({id : data.userId});
      //     // currentUser = data.user;
      //     console.log(currentUser);
      //     deferred.resolve(data);
      //     return cb();
      //   }).
      //   error(function(err) {
      //     this.logout();
      //     deferred.reject(err);
      //     return cb(err);
      //   }.bind(this));
	  //
      //   return deferred.promise;
      // },

      // /**
      //  * Delete access token and user info
      //  *
      //  * @param  {Function}
      //  */
      // logout: function() {
      //   $cookies.remove('token');
      //   currentUser = {};
      // },
	  //
      // /**
      //  * Create a new user
      //  *
      //  * @param  {Object}   user     - user info
      //  * @param  {Function} callback - optional
      //  * @return {Promise}
      //  */
      // createUser: function(user, callback) {
      //   var cb = callback || angular.noop;
	  //
      //   return User.save(user,
      //     function(data) {
      //       $cookies.put('token', data.token);
      //       currentUser = User.get();
      //       return cb(user);
      //     },
      //     function(err) {
      //       this.logout();
      //       return cb(err);
      //     }.bind(this)).$promise;
      // },

      // /**
      //  * Change password
      //  *
      //  * @param  {String}   oldPassword
      //  * @param  {String}   newPassword
      //  * @param  {Function} callback    - optional
      //  * @return {Promise}
      //  */
      // changePassword: function(oldPassword, newPassword, callback) {
      //   var cb = callback || angular.noop;
	  //
      //   return User.changePassword({ id: currentUser._id }, {
      //     oldPassword: oldPassword,
      //     newPassword: newPassword
      //   }, function(user) {
      //     return cb(user);
      //   }, function(err) {
      //     return cb(err);
      //   }).$promise;
      // },

      logout : function () {
        User
        .logout({access_token: LoopBackAuth.accessTokenId})
        .$promise
        .then(
          function (res, header) {
            LoopBackAuth.clearUser();
            LoopBackAuth.clearStorage();
            // localStorage.clear();

            var next = $location.nextAfterLogin || '/login';
            $location.nextAfterLogin = null;
            $location.path(next);
          },
          function (err) {
            console.log("login err", JSON.stringify(err));
          });
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function() {
        return currentUser;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return currentUser.hasOwnProperty('type');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function(cb) {
        console.log(cb);
        currentUser = User.getCurrent({id: LoopBackAuth.currentUserId});
        if(currentUser.hasOwnProperty('$promise')) {
          currentUser.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(true);
          });
        } else if(currentUser.hasOwnProperty('type')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin: function() {
        return currentUser.type === 'admin';
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isGroupMember: function() {
        return currentUser.type == 'group';
      },

      /**
       * Get auth token
       */
      getToken: function() {
        return $cookies.get('token');
      }
    };
  });
