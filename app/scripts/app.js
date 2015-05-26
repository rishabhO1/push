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
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl'
      })

      .otherwise({
        redirectTo: '/'
      });
  });
