'use strict';

/**
 * @ngdoc function
 * @name projectApp.controller:MailingListCtrl
 * @description
 * # MailingListCtrl
 * Controller of the projectApp
 */

angular.module('projectApp')
    .controller('mailingListCtrl', function($scope, $location, $timeout,$filter, storage, MailingList) {
        MailingList.query(function(data) {
            $scope.mailingLists = data;
        });

        $scope.deletemailingList = function(mailingListId) {
            MailingList.delete({
                id: mailingListId
            });
            $scope.mailingLists = $filter('filter')($scope.mailingLists, {_id: '!'+mailingListId})
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
        var refreshMailingLists = function(){
          MailingList.query(function(data) {
              $scope.mailingLists = data;
          });
        };
        $scope.save = function(mailingList) {
            if (storage.newMailingList) {
                MailingList.save(mailingList);
            } else {
                MailingList.update({
                    id: mailingList._id
                }, mailingList);
            }
            $timeout(function(){
              refreshMailingLists();
              $location.path('/mailingLists');
            }, 500);
        };
        $scope.back = function() {
            $location.path('/mailingLists');
        };
    });
