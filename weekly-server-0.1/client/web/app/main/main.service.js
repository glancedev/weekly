'use strict';

angular.module('testApp')
  .factory('timeFactory', function timeFactory() {

    return {

      getToday: function() {
        return moment().utcOffset(0).set({hour:0,minute:0,second:0,millisecond:0}).toISOString();
      },
      getYesterday: function () {
        return moment().utcOffset(0).set({hour:0,minute:0,second:0,millisecond:0}).add(-1, 'days').toISOString();
      },
      getTomorrow: function () {
        return moment().utcOffset(0).set({hour:0,minute:0,second:0,millisecond:0}).add(+1, 'days').toISOString();
      },
      getBeforeWeek: function () {
        return moment().utcOffset(0).set({hour:0,minute:0,second:0,millisecond:0}).add(-1, 'weeks').toISOString();
      },
      getBeforeMonth: function () {
        return moment().utcOffset(0).set({hour:0,minute:0,second:0,millisecond:0}).add(-1, 'months').toISOString();
      },
      getBefore3Month: function () {
        return moment().utcOffset(0).set({hour:0,minute:0,second:0,millisecond:0}).add(-3, 'months').toISOString();
      },
      getBefore6Month: function () {
        return moment().utcOffset(0).set({hour:0,minute:0,second:0,millisecond:0}).add(-6, 'months').toISOString();
      },
      getBeforeYear: function () {
        return moment().utcOffset(0).set({hour:0,minute:0,second:0,millisecond:0}).add(-1, 'years').toISOString();
      },
    }
  })

