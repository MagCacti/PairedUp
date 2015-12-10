angular.module('myApp', [
	'ui.router',
  // 'ngRoute',
	'ui.ace',
	'ui.bootstrap',
	'myApp.codeshare',
   //for client side sockets
  'btford.socket-io',
    //for the authentication.
   'satellizer'
   // 'Icecomm'
])
.config(function($stateProvider, $urlRouterProvider, $locationProvider, $authProvider){

	// $urlRouterProvider.otherwise('/signup');

	$stateProvider
		.state('signup', {
			url: '/signup',
			templateUrl: 'auth/signup/signup.html'
		})
		.state('mentee', {
			url: '/mentee',
			templateUrl: 'auth/signup/menteesignup.html'
		})
		.state('mentor', {
			url: '/mentor',
			templateUrl: 'auth/signup/mentorsignup.html'
		})

		.state('login', {
			url: '/login',
			templateUrl: 'auth/login/login.html',
			controller: 'LoginController',
      resolve: {
        skipIfLoggedIn: skipIfLoggedIn
      }
		})
    .state('logout', {
      url: '/logout',
      template: null,
      controller: 'LogoutController'
    })
		.state('map', {
			url: '/map',
			templateUrl: 'map/map.html'
		})

    .state('profile', {
      url: '/profile',
      templateUrl: 'userprofile/userprofile.html',
      controller: 'ProfileController',
      resolve: {
        loginRequired: loginRequired
      }
    })

		.state('codeshare', {
			url: '/codeshare',
			templateUrl: 'codeshare/codeshare.html',
			controller: 'CodeShareController'
		})

	$urlRouterProvider.otherwise('/');

	$authProvider.github({
    clientId: "6ffd349ee17a258a13ff",
    url: '/auth/github',
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    redirectUri: window.location.origin,
    optionalUrlParams: ['scope'],
    scope: ['user'],
    scopeDelimiter: ' ',
    type: '2.0',
    popupOptions: { width: 1020, height: 618 }
	});

	function skipIfLoggedIn($q, $auth) {
	      var deferred = $q.defer();
	      if ($auth.isAuthenticated()) {
	        deferred.reject();
	      } else {
	        deferred.resolve();
	      }
	      return deferred.promise;
	    }

  function loginRequired($q, $location, $auth) {
	      var deferred = $q.defer();
	      if ($auth.isAuthenticated()) {
	        deferred.resolve();
          console.log('hi, i am in');
	      } else {
	        $location.path('/login');
	      }
	      return deferred.promise;
	    }

})

.controller('LoginController', function($scope, $auth, $location) {


   // $scope.login = function() {
   //    $auth.login($scope.user)
   //      .then(function() {
   //    console.log($scope.user);
   //        // toastr.success('You have successfully signed in!');
   //        $location.path('/');
   //      })
   //      .catch(function(error) {
   //        // toastr.error(error.data.message, error.status);
   //      });
   //  };
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
      .then(function() {

          console.log('You have successfully signed in with ' + provider + '!');
          $location.path('/profile')
        })
        .catch(function(error) {
          if (error.error) {
            // Popup error - invalid redirect_uri, pressed cancel button, etc.
            console.log(error);
            // toastr.error(error.error);
          } else if (error.data) {
            // HTTP response error from server
            // toastr.error(error.data.message, error.status);
            console.log('hiii')
          } else {
            // toastr.error(error);
            console.log('heyyyy');
          }
        });
    };
})

/*

  Nav Bar Controller

*/

.controller('NavbarController', function($scope, $auth) {
  $scope.isAuthenticated = function() {
    return $auth.isAuthenticated();
  };
})

.controller('LogoutController', function($location, $auth) {
    if (!$auth.isAuthenticated()) { return; }
    $auth.logout()
      .then(function() {
        // toastr.info('You have been logged out');
        $location.path('/');
      });
  })


.factory('Account', function($http) {
    return {
      getProfile: function() {
        console.log('inside the factory-------------');
        return $http.get('/api/me');
      },
      updateProfile: function(profileData) {
        return $http.put('/api/me', profileData);
      }
    };
  })
