'use strict';

angular.module('projectApp')
.controller('EventCtrl', function ($scope, Event) {
  Event.query(function(data) {
    $scope.events = data;
  });

  $scope.deleteEvent = function (eventId) {
    EventService.delete({ id: eventId });
    EventService.query(function(data) {
      $scope.events = data;
    });
  };

  $scope.editEvent = function(event) {
    $scope.opts = ['on', 'off'];

    if (event === 'new') {
      $scope.newEvent = true;
      $scope.event = {name: ''};
    }
    else {
      $scope.newEvent = false;
      $scope.event = event;
    }
  };
});
