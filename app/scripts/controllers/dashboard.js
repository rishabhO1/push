'use strict';

/**
 * @ngdoc function
 * @name projectApp.controller:MailingListCtrl
 * @description
 * # MailingListCtrl
 * Controller of the projectApp
 */

angular.module('projectApp')
    .controller('DashboardCtrl', ['$scope', '$location', 'MailingList', '$http', function($scope, $location, MailingList, $http) {
        MailingList.query(function(data) {
            $scope.mailingLists = data;
        });
        console.log($scope.currentUser);
        $scope.containsObject = function(obj, list) {
          var i;
          for (i = 0; i < list.length; i++) {
            if (angular.equals(list[i], obj)) {
              return true;
            }
          }

          return false;
        };
        $scope.subscribe = function(mailingList){
          $http
          .post('http://localhost:8080/api/subscribe', {
            username: $scope.currentUser.id,
            mailingListId: mailingList._id
          })
          .then(function(res) {
            console.log(res);
            if (res.data.message=="Success"){
              $scope.currentUser.mailingLists.push(mailingList._id);
            }
          });
        }
        $scope.unsubscribe = function(mailingList){
          console.log(mailingList._id);
          console.log("unsubscribe");
        }
    }]);
