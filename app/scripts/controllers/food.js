'use strict';

/**
 * @ngdoc function
 * @name projectApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the projectApp
 */
angular.module('projectApp')
  .controller('FoodCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
