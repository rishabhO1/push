'use strict';

/**
 * @ngdoc function
 * @name projectApp.controller:EventCtrl
 * @description
 * # EventCtrl
 * Controller of the projectApp
 */

angular.module('projectApp')
    .controller('EventCtrl', function($scope, $location, storage, Event) {
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
    .controller('EventEditCtrl', function($scope, $location, storage, Event) {
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
        };
    });
