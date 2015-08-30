'use strict';

/**
 * @ngdoc function
 * @name projectApp.controller:MailingListCtrl
 * @description
 * # MailingListCtrl
 * Controller of the projectApp
 */

angular.module('projectApp')
    .controller('DashboardCtrl', ['$scope', '$location', 'MailingList', function($scope, $location, MailingList) {
        MailingList.query(function(data) {
            $scope.mailingLists = data;
        });
    }]);