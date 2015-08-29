'use strict';

/**
 * @ngdoc overview
 * @name projectApp
 * @description
 * # projectApp
 *
 * Main module of the application.
 */
angular
    .module('projectApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'mgcrea.ngStrap',
        'ui.router'
    ])
    .factory('Event', function($resource) {
        return $resource('http://localhost:8080/api/events/:id', null, {
            'update': {
                method: 'PUT'
            }
        });
    })
    .factory('MailingList', function($resource) {
        return $resource('http://localhost:8080/api/mailingLists/:id', null, {
            'update': {
                method: 'PUT'
            }
        });
    })
    .factory('storage', function() {
        return {};
    })
    .factory('credentials', function($http) {
        return {
            logIn: function(username, password) {
                return $http.post('http://localhost:8080/api/register/:id', {
                    username: username,
                    password: password
                });
            },

            logOut: function() {

            }
        }
    })
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .when('/signup', {
                templateUrl: 'views/signup.html',
                controller: 'SignUpCtrl'
            })
            .when('/dashboard', {
                templateUrl: 'views/dashboard.html',
                controller: 'LoginCtrl'
            })
            .when('/event/edit', {
                templateUrl: 'views/events/eventEdit.html',
                controller: 'EventEditCtrl'
            })
            .when('/event', {
                templateUrl: 'views/events/eventList.html',
                controller: 'EventCtrl'
            })
            .when('/mailingLists', {
                templateUrl: 'views/mailingList/mailingList.html',
                controller: 'mailingListCtrl'
            })
            .when('/mailingLists/edit', {
                templateUrl: 'views/mailingList/mailingListEdit.html',
                controller: 'mailingListEditCtrl'
            })

        .otherwise({
            redirectTo: '/'
        });
    });
