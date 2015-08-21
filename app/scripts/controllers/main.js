'use strict';

/**
 * @ngdoc function
 * @name projectApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the projectApp
 */
angular.module('projectApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  })
  .controller('LoginCtrl', function($scope, $location, storage, Event) {
        Event.query(function(data) {
            $scope.events = data;
        });

        $scope.deleteEvent = function(eventId) {
            Event.delete({
                id: eventId
            });
            Event.query(function(data) {
                $scope.events = data;
            });
        };

        $scope.editEvent = function(event) {
            if (event === 'new') {
                storage.newEvent = true;
            } else {
                storage.newEvent = false;
                storage.editedEvent = event;
            }
            $location.path('/event/edit');
        };
    })
    .controller('RegisterCtrl', function($scope, $location, storage, Event) {
        $scope.editedEvent = storage.editedEvent;
        $scope.save = function(event) {
            if (storage.newEvent) {
                Event.save(event);
            } else {
                Event.update({
                    id: event._id
                }, event);
            }
            $location.path('/event');
        };
        $scope.back = function() {
            $location.path('/event');
        }
    });

