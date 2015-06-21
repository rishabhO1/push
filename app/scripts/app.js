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
    'ngTouch'
  ])
  .factory("Event", function($resource) {
    return $resource("http://localhost:8080/api/events/:id", null, { 'update': { method:'PUT' } });
  })
  .factory("mailingList", function($resource) {
    return $resource("http://localhost:8080/api/mailingList/:id", null, { 'update': { method:'PUT' } });
  })
  .factory("storage", function() {
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
        controller: 'AcademicCtrl'
      })
      .when('/hostel', {
        templateUrl: 'views/hostel.html',
        controller: 'HostelCtrl'
      })
      .when('/clubs', {
        templateUrl: 'views/clubs.html',
        controller: 'ClubsCtrl'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
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
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .when('/mailingList', {
        templateUrl: 'views/mailingList.html',
        controller: 'mailingListCtrl'
      })
      .when('/mailingList/edit', {
        templateUrl: 'views/mailingListEdit.html',
        controller: 'mailingListEditCtrl'
      })

      .otherwise({
        redirectTo: '/'
      });
  });
