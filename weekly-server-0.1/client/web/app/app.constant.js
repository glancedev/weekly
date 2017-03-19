(function(angular, undefined) {
  angular.module("testApp.constants", [])

.constant("appConfig", {
	"userRoles": [
		"guest",
		"user",
		"admin"
	]
});

  angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 500)


})(angular);