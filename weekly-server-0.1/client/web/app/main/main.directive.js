'use strict';

angular.module('testApp')
  .directive('pageTitle', pageTitle)
  .directive('sideNavigation', sideNavigation)
  .directive('minimalizaMenu', minimalizaMenu)
  .directive('sparkline', sparkline)
  .directive('icheck', icheck)
  .directive('smallHeader', smallHeader)
  .directive('animatePanel', animatePanel)
  .directive('landingScrollspy', landingScrollspy)
  .directive('clockPicker', clockPicker)
  .directive('dateTimePicker', dateTimePicker)
  .directive('inputPressEnter', inputPressEnter)
  .directive('uibTypeaheadPopup', uibTypeaheadPopup)
  .decorator('uibTypeaheadPopupDirective', function($delegate){
    return([$delegate[1]]);
  })
;

/**
 * pageTitle - Directive for set Page title - mata title
 */
function pageTitle($rootScope, $timeout) {
  return {
    link: function(scope, element) {
      var listener = function(event, toState, toParams, fromState, fromParams) {
        // Default title
        var title = 'Startup Weekly';
        // Create your own title pattern
        if (toState.data && toState.data.pageTitle) title = 'Startup Weekly | ' + toState.data.pageTitle;
        $timeout(function() {
          element.text(title);
        });
      };
      $rootScope.$on('$stateChangeStart', listener);
    }
  }
};

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
function sideNavigation($timeout) {
  return {
    restrict: 'A',
    link: function(scope, element) {
      // Call the metsiMenu plugin and plug it to sidebar navigation
      element.metisMenu();

      // Colapse menu in mobile mode after click on element
      var menuElement = $('#side-menu a:not([href$="\\#"])');
      menuElement.click(function(){

        if ($(window).width() < 769) {
          $("body").toggleClass("show-sidebar");
        }
      });


    }
  };
};

/**
 * minimalizaSidebar - Directive for minimalize sidebar
 */
function minimalizaMenu($rootScope) {
  return {
    restrict: 'EA',
    template: '<div class="header-link hide-menu" ng-click="minimalize()"><i class="fa fa-bars"></i></div>',
    controller: function ($scope, $element) {

      $scope.minimalize = function () {
        if ($(window).width() < 769) {
          $("body").toggleClass("show-sidebar");
        } else {
          $("body").toggleClass("hide-sidebar");
        }
      }
    }
  };
};


/**
 * sparkline - Directive for Sparkline chart
 */
function sparkline() {
  return {
    restrict: 'A',
    scope: {
      sparkData: '=',
      sparkOptions: '=',
    },
    link: function (scope, element, attrs) {
      scope.$watch(scope.sparkData, function () {
        render();
      });
      scope.$watch(scope.sparkOptions, function(){
        render();
      });
      var render = function () {
        $(element).sparkline(scope.sparkData, scope.sparkOptions);
      };
    }
  }
};

/**
 * icheck - Directive for custom checkbox icheck
 */
function icheck($timeout) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function($scope, element, $attrs, ngModel) {
      return $timeout(function() {
        var value;
        value = $attrs['value'];

        $scope.$watch($attrs['ngModel'], function(newValue){
          $(element).iCheck('update');
        })

        return $(element).iCheck({
          checkboxClass: 'icheckbox_square-green',
          radioClass: 'iradio_square-green'

        }).on('ifChanged', function(event) {
          if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
            $scope.$apply(function() {
              return ngModel.$setViewValue(event.target.checked);
            });
          }
          if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
            return $scope.$apply(function() {
              return ngModel.$setViewValue(value);
            });
          }
        });
      });
    }
  };
}

/**
 * smallHeader - Directive for page title panel
 */
function smallHeader() {
  return {
    restrict: 'A',
    scope:true,
    controller: function ($scope, $element) {
      $scope.small = function() {
        var icon = $element.find('i:first');
        var breadcrumb  = $element.find('#hbreadcrumb');
        $element.toggleClass('small-header');
        breadcrumb.toggleClass('m-t-lg');
        icon.toggleClass('fa-arrow-up').toggleClass('fa-arrow-down');
      }
    }
  }
}

function animatePanel($timeout,$state) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {

      //Set defaul values for start animation and delay
      var startAnimation = 0;
      var delay = 0.06;   // secunds
      var start = Math.abs(delay) + startAnimation;

      // Store current state where directive was start
      var currentState = $state.current.name;

      // Set default values for attrs
      if(!attrs.effect) { attrs.effect = 'zoomIn'};
      if(attrs.delay) { delay = attrs.delay / 10 } else { delay = 0.06 };
      if(!attrs.child) { attrs.child = '.row > div'} else {attrs.child = "." + attrs.child};

      // Get all visible element and set opactiy to 0
      var panel = element.find(attrs.child);
      panel.addClass('opacity-0');

      // Count render time
      var renderTime = panel.length * delay * 1000 + 700;

      // Wrap to $timeout to execute after ng-repeat
      $timeout(function(){

        // Get all elements and add effect class
        panel = element.find(attrs.child);
        panel.addClass('stagger').addClass('animated-panel').addClass(attrs.effect);

        var panelsCount = panel.length + 10;
        var animateTime = (panelsCount * delay * 10000) / 10;

        // Add delay for each child elements
        panel.each(function (i, elm) {
          start += delay;
          var rounded = Math.round(start * 10) / 10;
          $(elm).css('animation-delay', rounded + 's');
          // Remove opacity 0 after finish
          $(elm).removeClass('opacity-0');
        });

        // Clear animation after finish
        $timeout(function(){
          $('.stagger').css('animation', '');
          $('.stagger').removeClass(attrs.effect).removeClass('animated-panel').removeClass('stagger');
          panel.resize();
        }, animateTime)

      });



    }
  }
}

function landingScrollspy(){
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.scrollspy({
        target: '.navbar-fixed-top',
        offset: 80
      });
    }
  }
}

/**
 * clockPicker - Directive for clock picker plugin
 */
function clockPicker() {
  return {
    restrict: 'A',
    link: function(scope, element) {
      element.clockpicker();
    }
  };
};

function dateTimePicker(){
  return {
    require: '?ngModel',
    restrict: 'AE',
    scope: {
      pick12HourFormat: '@',
      language: '@',
      useCurrent: '@',
      location: '@'
    },
    link: function (scope, elem, attrs) {
      elem.datetimepicker({
        pick12HourFormat: scope.pick12HourFormat,
        language: scope.language,
        useCurrent: scope.useCurrent
      })

      //Local event change
      elem.on('blur', function () {

        // For test
        //console.info('this', this);
        //console.info('scope', scope);
        //console.info('attrs', attrs);


        /*// returns moments.js format object
         scope.dateTime = new Date(elem.data("DateTimePicker").getDate().format());
         // Global change propagation
         $rootScope.$broadcast("emit:dateTimePicker", {
         location: scope.location,
         action: 'changed',
         dateTime: scope.dateTime,
         example: scope.useCurrent
         });
         scope.$apply();*/
      })
    }
  };
}

function inputPressEnter() {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if (event.which === 13) {
        scope.$apply(function () {
          scope.$eval(attrs.inputPressEnter);
        });
        event.preventDefault();
      }
    });
  };
}

function uibTypeaheadPopup($$debounce) {
  return {
    scope: {
      matches: '=',
      query: '=',
      active: '=',
      position: '&',
      moveInProgress: '=',
      select: '&',
      assignIsOpen: '&',
      debounce: '&'
    },
    replace: true,
    templateUrl: function(element, attrs) {
      return attrs.popupTemplateUrl || 'uib/template/typeahead/typeahead-popup.html';
    },
    link: function(scope, element, attrs) {
      scope.templateUrl = attrs.templateUrl;

      scope.isOpen = function() {
        var isDropdownOpen = scope.matches.length > 0;
        scope.assignIsOpen({ isOpen: isDropdownOpen });
        return isDropdownOpen;
      };

      scope.isActive = function(matchIdx) {
        return scope.active === matchIdx;
      };

      scope.selectActive = function(matchIdx) {
        scope.active = matchIdx;
      };

      scope.selectMatch = function(activeIdx, evt) {
        var debounce = scope.debounce();
        if (angular.isNumber(debounce) || angular.isObject(debounce)) {
          $$debounce(function() {
            scope.select({activeIdx: activeIdx, evt: evt});
          }, angular.isNumber(debounce) ? debounce : debounce['default']);
        } else {
          scope.select({activeIdx: activeIdx, evt: evt});
        }
      };

      scope.selectMatchExt = function(activeIdx, evt, callback) {
        var debounce = scope.debounce();
        if (angular.isNumber(debounce) || angular.isObject(debounce)) {
          $$debounce(function() {
            scope.select({activeIdx: activeIdx, evt: evt});
          }, angular.isNumber(debounce) ? debounce : debounce['default']);
        } else {
          scope.select({activeIdx: activeIdx, evt: evt});
        }
        if (callback) {
          eval(callback);
        }
      };
    }
  };
}
