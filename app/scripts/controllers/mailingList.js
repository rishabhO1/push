'use strict';

/**
 * @ngdoc function
 * @name projectApp.controller:MailingListCtrl
 * @description
 * # MailingListCtrl
 * Controller of the projectApp
 */

angular.module('projectApp')
    .controller('mailingListCtrl', function($scope, $location, $timeout, storage, MailingList) {
        MailingList.query(function(data) {
            $scope.mailingLists = data;
        });

        $scope.deletemailingList = function(mailingListId) {
            MailingList.delete({
                id: mailingListId
            });
            $timeout(function(mailingListId) {
                $scope.mailingLists.splice($scope.mailingLists.indexOf(mailingListId), 1);
                // splice not working correctly
            });
        };

        $scope.editmailingList = function(mailingList) {
            if (mailingList === 'new') {
                storage.newMailingList = true;
            } else {
                storage.newMailingList = false;
                storage.editedMailingList = mailingList;
            }
            $location.path('/mailingLists/edit');
        };
    })
    .controller('mailingListEditCtrl', function($scope, $location, $timeout, storage, MailingList) {
        $scope.editedMailingList = storage.editedMailingList;
        MailingList.query(function(data) {
            $scope.mailingLists = data;
        });
        $scope.save = function(mailingList) {
            if (storage.newMailingList) {
                MailingList.save(mailingList);
            } else {
                MailingList.update({
                    id: mailingList._id
                }, mailingList);
            }
            MailingList.query(function(data) {
                $scope.mailingLists = data;
            });
            $scope.mailingLists.push(mailingList._id);
            $location.path('/mailingLists');
        };
        $scope.back = function() {
            $location.path('/mailingLists');
        };
    });