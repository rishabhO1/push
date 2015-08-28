'use strict';

/**
 * @ngdoc function
 * @name projectApp.controller:SignUpCtrl
 * @description
 * # SignUpCtrl
 * Controller of the projectApp
 */

angular.module('projectApp')
    .controller('SignUpCtrl', ['$scope', '$rootScope', function($scope, $location, storage, User) {
        $scope.credentials = {
            username: '',
            password: '',
            contact: '',
            email:''
        };
        User.query(function(data) {
            $scope.User = data;
        });

        $scope.register = function(credentials) {
            if (credentials.username === 'new') {
                storage.newUser = true;
            } else {
                storage.newUser = false;
            }
            $location.path('/signup');
        };
    }]);