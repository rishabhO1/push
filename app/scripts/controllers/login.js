'use strict';

/**
 * @ngdoc function
 * @name projectApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the projectApp
 */
angular.module('projectApp')
.controller('LoginCtrl', ['$scope', '$rootScope', '$location', 'AuthService', 'AUTH_EVENTS', 'userService', function($scope, $rootScope, $location, AuthService, AUTH_EVENTS, userService) {
  $scope.credentials = {
    username: '',
    password: ''
  };
  $scope.login = function(credentials) {
    AuthService.login(credentials).then(function(user) {
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      $scope.setCurrentUser(user);
      $location.path('/dashboard');
      userService.user.isLogged = true;
    }, function() {
      $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
    });
  };
}])

// Communicating session changes
.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})
.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  editor: 'editor',
  guest: 'guest'
})

// The AuthService
.factory('AuthService', function($http, Session) {
  var authService = {};

  authService.login = function(credentials) {
    return $http
    .post('http://localhost:8080/api/login', credentials)
    .then(function(res) {
      Session.create(res.data.id, res.data.user.id,
                     res.data.user.role);
                     return res.data.user;
    });
  };

  authService.isAuthenticated = function() {
    return !!Session.userId;
  };

  authService.isAuthorized = function(authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (authService.isAuthenticated() &&
            authorizedRoles.indexOf(Session.userRole) !== -1);

  };

  return authService;
})
.service('Session', function() {
  this.create = function(sessionId, userId, userRole) {
    this.id = sessionId;
    this.userId = userId;
    this.userRole = userRole;
  };
  this.destroy = function() {
    this.id = null;
    this.userId = null;
    this.userRole = null;
  };
})
.controller('ApplicationController', ['$scope', '$rootScope', '$location','USER_ROLES','AuthService', 'userService', 'toaster', function($scope, $rootScope, $location, USER_ROLES, AuthService, userService, toaster) {
  $scope.currentUser = null;
  $scope.userRoles = USER_ROLES;
  $scope.isAuthorized = AuthService.isAuthorized;

  // restricting route access
  $scope.user = userService.user;
  $scope.$on('$routeChangeStart', function (e, next, current) {               
     if (next.access !== undefined && !next.access.allowAnonymous && !$scope.user.isLogged) {
                $location.path('/Login');                   
            }
  });
  $rootScope.$on('$locationChangeStart', function (event, next, current) {
    for (var i in window.routes) {
      if (next.indexOf(i) !== -1) {
       if (!window.routes[i].access.allowAnonymous && !userService.user.isLogged) {
            toaster.pop('error', 'You are not logged in!', '');
               $location.path('/Login');                                                 
        }}}
  });

  $scope.setCurrentUser = function(user) {
    $scope.currentUser = user;
  };
}])

// Access Control
//Restricting route access
.config(function($stateProvider, USER_ROLES) {
  $stateProvider.state('dashboard', {
    url: '/dashboard',
    templateUrl: 'views/dashboard.html',
    data: {
      authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor]
    }
  });
})
.run(function($rootScope, AUTH_EVENTS, AuthService) {
  $rootScope.$on('$stateChangeStart', function(event, next) {
    var authorizedRoles = next.data.authorizedRoles;
    if (!AuthService.isAuthorized(authorizedRoles)) {
      event.preventDefault();
      if (AuthService.isAuthenticated()) {
        // user is not allowed
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      } else {
        // user is not logged in
        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
      }
    }
  });
});

/*
// Session expiration
.config(function($httpProvider) {
$httpProvider.interceptors.push([
'$injector',
function($injector) {
return $injector.get('AuthInterceptor');
}
]);
})
.factory('AuthInterceptor', function($rootScope, $q, AUTH_EVENTS) {
return {
responseError: function(response) {
$rootScope.$broadcast({
401: AUTH_EVENTS.notAuthenticated,
403: AUTH_EVENTS.notAuthorized,
419: AUTH_EVENTS.sessionTimeout,
440: AUTH_EVENTS.sessionTimeout
}[response.status], response);
return $q.reject(response);
}
}
})

// The loginDialog directive
.directive('loginDialog', function(AUTH_EVENTS) {
return {
restrict: 'A',
template: '<div ng-if="visible"
ng - include = "\'login-form.html\'" > ',
link: function(scope) {
var showDialog = function() {
scope.visible = true;
};

scope.visible = false;
scope.$on(AUTH_EVENTS.notAuthenticated, showDialog);
scope.$on(AUTH_EVENTS.sessionTimeout, showDialog);
}
};
})

// Issues with the login form
.directive('formAutofillFix', function($timeout) {
return function(scope, element, attrs) {
element.prop('method', 'post');
if (attrs.ngSubmit) {
$timeout(function() {
element
.unbind('submit')
.bind('submit', function(event) {
event.preventDefault();
element
.find('input, textarea, select')
.trigger('input')
.trigger('change')
.trigger('keydown');
scope.$apply(attrs.ngSubmit);
});
});
}
};
})

// Restoring user state
$stateProvider.state('protected-route', {
url: '/protected',
resolve: {
auth: function resolveAuthentication(AuthResolver) {
return AuthResolver.resolve();
}
}
})

.factory('AuthResolver', function($q, $rootScope, $state) {
    return {
resolve: function() {
var deferred = $q.defer();
var unwatch = $rootScope.$watch('currentUser', function(currentUser) {
  if (angular.isDefined(currentUser)) {
  if (currentUser) {
  deferred.resolve(currentUser);
  } else {
  deferred.reject();
  $state.go('user-login');
  }
  unwatch();
  }
  });
return deferred.promise;
}
};
})
*/