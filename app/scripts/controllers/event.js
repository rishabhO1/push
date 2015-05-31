'use strict';

angular.module('projectApp')
.controller('EventCtrl', function ($scope, Event) {
  Event.query(function(data) {
    $scope.events = data;
  });
});
