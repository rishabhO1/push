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
        'ui.router',
        'toaster'
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
    .factory('userService', function () {
        var user = {
            isLogged: false
        };

        var reset = function() {
            user.isLogged = false;
        };

        return {
            user: user,
            reset : reset
          };
    })
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                access : {allowAnonymous : true}
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl',
                access : {allowAnonymous : true}
            })
            .when('/signup', {
                templateUrl: 'views/signup.html',
                controller: 'SignUpCtrl',
                access : {allowAnonymous : true}
            })
            .when('/dashboard', {
                templateUrl: 'views/dashboard.html',
                controller: 'DashboardCtrl',
                access : {allowAnonymous : false}
            })
            .when('/event/edit', {
                templateUrl: 'views/events/eventEdit.html',
                controller: 'EventEditCtrl',
                access : {allowAnonymous : false}
            })
            .when('/event', {
                templateUrl: 'views/events/eventList.html',
                controller: 'EventCtrl',
                access : {allowAnonymous : false}
            })
            .when('/mailingLists', {
                templateUrl: 'views/mailingList/mailingList.html',
                controller: 'mailingListCtrl',
                access : {allowAnonymous : false}
            })
            .when('/mailingLists/edit', {
                templateUrl: 'views/mailingList/mailingListEdit.html',
                controller: 'mailingListEditCtrl',
                access : {allowAnonymous : false}
            })
            .when('/profile', {
                templateUrl: 'views/profile.html',
                controller: 'DashboardCtrl',
                access : {allowAnonymous : false}
            })

        .otherwise({
            redirectTo: '/'
        });
    });
