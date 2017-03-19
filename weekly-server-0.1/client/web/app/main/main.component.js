'use strict';

angular.module('testApp')
  .component('mainComponent', function () {

  })
  .component('newsLocationComponent', function () {
    templateUrl: 'uib/template/typeahead/typeahead-popup-searchTools-location.html'
  })
  .component('newsMarketsComponent', function () {
    templateUrl: 'uib/template/typeahead/typeahead-popup-searchTools-markets.html'
  })
  .component('newsSkillsComponent', function () {
    templateUrl: 'uib/template/typeahead/typeahead-popup-searchTools-skills.html'
  })

;
