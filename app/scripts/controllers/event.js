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
              })
            .$promise.then(function(eventId) {
                $scope.events.splice($scope.events.indexOf(eventId), 1);
                Event.query(function(data) {
                $scope.events = data;
                });
            }, 
            function (err) {
                console.error(err);
            });
            // TODO
            // Refreshing
            Event.delete({
                id: eventId
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
              })
            .$promise.then(function(eventId) {
              $scope.events.push(eventId);
              $location.path('/event');
              Event.query(function(data) {
                    $scope.events = data;
              });
            }, 
            function (err) {
                console.error(err);
            });
            // TODO
            // Refreshing
        };
        $scope.back = function() {
            $location.path('/event');
        };
    });
