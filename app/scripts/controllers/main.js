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
  .controller('LoginCtrl', function($scope, $location, storage, Event, $http) {
    $scope.test='waa'
        $scope.submit = function() {
          console.log('testing');
          $http.post('http://localhost:8080/api/login', {username: $scope.username, password: $scope.password}).then(
            function(response) {
              console.log(response);
            }, function (response) {
              console.log("error");
            }
          )
        }
    });

