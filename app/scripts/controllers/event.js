'use strict';

/**
 * @ngdoc function
 * @name projectApp.controller:EventCtrl
 * @description
 * # EventCtrl
 * Controller of the projectApp
 */

angular.module('projectApp')
    .controller('EventCtrl', function($scope, $location, $http, $timeout, storage, Event, MailingList) {
        Event.query(function(data) {
            $scope.events = data;
        });

        $scope.deleteEvent = function(eventId) {
            $http.post('http://localhost:8080/api/removefromml', {
                mailingListName : $scope.mailingListName,
                eventId: eventId
              })
            .then(function(){
                $location.path('/event');
            });
            Event.delete({
                id: eventId
            });
            $location.path('/event');
            $timeout(function(eventId) {
                $scope.events.splice($scope.events.indexOf(eventId), 1);
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
    .controller('EventEditCtrl', function($scope, $location, $http, $timeout, storage, Event, MailingList) {
        $scope.editedEvent = storage.editedEvent;
        MailingList.query(function(data) {
            $scope.mailingLists = data;
        });
        Event.query(function(data) {
            $scope.events = data;
        });
        $scope.save = function(event) {
            if (storage.newEvent) {
                Event.save(event);
            } else {
                Event.update({
                    id: event._id
                }, event);
            }
            $http.post('http://localhost:8080/api/addtoml', {
                mailingListName : $scope.mailingListName,
                eventId: event._id
              })
            .then(function(){
                $location.path('/event');
            });
        };
        $scope.back = function() {
            $location.path('/event');
        };
    });
