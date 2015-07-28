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
    'mgcrea.ngStrap'
  ])
  .factory('Event', function($resource) {
    return $resource('http://localhost:8080/api/events/:id', null, { 'update': { method:'PUT' } });
  })
  .factory('MailingList', function($resource) {
    return $resource('http://localhost:8080/api/mailingLists/:id', null, { 'update': { method:'PUT' } });
  })
  .factory('storage', function() {
    return {};
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/class', {
        templateUrl: 'views/academic.html',
        controller: 'AboutCtrl'
      })
      .when('/hostel', {
        templateUrl: 'views/hostel.html',
        controller: 'AboutCtrl'
      })
      .when('/clubs', {
        templateUrl: 'views/clubs.html',
        controller: 'AboutCtrl'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'AboutCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'AboutCtrl'
      })
      .when('/event/edit', {
        templateUrl: 'views/events/eventEdit.html',
        controller: 'EventEditCtrl'
      })
      .when('/event', {
        templateUrl: 'views/events/eventList.html',
        controller: 'EventCtrl'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'AboutCtrl'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'AboutCtrl'
      })
      .when('/mailingLists', {
        templateUrl: 'views/mailingList/mailingList.html',
        controller: 'mailingListCtrl'
      })
      .when('/mailingLists/edit', {
        templateUrl: 'views/mailingList/mailingListEdit.html',
        controller: 'mailingListEditCtrl'
      })
      .when('/academicEvents', {
        templateUrl: 'views/academicEvents.html',
        controller: 'AboutCtrl'
      })
      .when('/clubEvents', {
        templateUrl: 'views/clubEvents.html',
        controller: 'AboutCtrl'
      })
      .when('/hostelEvents', {
        templateUrl: 'views/hostelEvents.html',
        controller: 'AboutCtrl'
      })

      .otherwise({
        redirectTo: '/'
      });
  });
