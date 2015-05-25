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
        templateUrl: 'views/class.html',
        controller: 'ClassCtrl'
      })
      .when('/attendance', {
        templateUrl: 'views/attendance.html',
        controller: 'AttendanceCtrl'
      })
      .when('/food', {
        templateUrl: 'views/food.html',
        controller: 'FoodCtrl'
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
