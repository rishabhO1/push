'use strict';

/**
 * @ngdoc function
 * @name projectApp.controller:EventCtrl
 * @description
 * # EventCtrl
 * Controller of the projectApp
 */

angular.module('projectApp')
    .controller('EventCtrl', function($scope, $location, $http, storage, Event, MailingList) {
        Event.query(function(data) {
            $scope.events = data;
        });

        $scope.deleteEvent = function(eventId) {
            $http.post('http://localhost:8080/api/removefromml', {
                eventId: eventId
              });
            Event.delete({
                id: eventId
            });
            //$scope.events.splice($scope.events.indexOf(eventId), 1);
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
    .controller('EventEditCtrl', function($scope, $location, $http, storage, Event, MailingList) {
        $scope.editedEvent = storage.editedEvent;
        MailingList.query(function(data) {
            $scope.mailingLists = data;
        });
        $scope.save = function(event) {
            if (storage.newEvent) {
                Event.save(event);
            } else {
                Event.update({
                    id: event._id
                }, event);
            }
            $http.post('http://localhost:8080/api/removefromml', {
                eventId: event._id
              });
            $location.path('/event');
            //$scope.events.push(event._id);
        };
        $scope.back = function() {
            $location.path('/event');
        };
    });
