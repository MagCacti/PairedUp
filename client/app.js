angular.module('myApp', [
	'ui.router',
	'ui.ace',
	'ui.bootstrap',
            'btford.socket-io',
	'satellizer',
	'myApp.codeshare'
])
.config( function($stateProvider, $urlRouterProvider, $locationProvider, $authProvider){

	$urlRouterProvider.otherwise('/signup');

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
			controller: 'LoggedIn'
		})
		.state('map', {
			url: '/map',
			templateUrl: 'map/map.html'
		})

		// codeshare was added using the following: https://github.com/angular-ui/ui-ace
			
		// 	you can also trying implementing the ace raw 

		// 	https://ace.c9.io/

		// 	in order to view this page you must install bower like so 
		// 	bower install angular-ui-ace#bower
		// 	or 
		// 	bower install -g --save angular-ui-ace#bower

		// 	whatever works for you
		.state('codeshare', {
			url: '/codeshare',
			templateUrl: 'codeshare/codeshare.html',
			controller: 'CodeShareController'
		})

	$urlRouterProvider.otherwise('/');

	$authProvider.github({
      	clientId: "secret"
    	});
	console.log("window.location.origin", window.location.origin);
	$authProvider.github({
	  url: '/auth/github',
	  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
	  redirectUri: window.location.origin, //? window.location.origin +  '/auth/github/callback' : window.location.protocol + '//' + window.location.host + '/auth/github/callback',
	  optionalUrlParams: ['scope'],
	  scope: ['user:email'],
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
	      } else {
	        $location.path('/login');
	      }
	      return deferred.promise;
	    }

})

// .directive('iceComm', function($sce) {
//   return {
//     restrict: 'E',
//     scope: {},
//     templateUrl: "codeshare/codeshare.html",
//     link: function($scope, ele, atts) {
//       console.log("link");
//       var comm = new Icecomm( atts.apikey );
//       $scope.peers = [];
//       comm.on("local",function(peer){
//         $scope.$apply(function () {
//           peer.stream = $sce.trustAsResourceUrl(peer.stream);
//           $scope.local = peer;
//         });
//       });
//       comm.on("connected", function(peer){
//         $scope.$apply(function () {
//           peer.stream = $sce.trustAsResourceUrl(peer.stream);
//           $scope.peers.push(peer);
//         });
//       });
      
//       comm.on("disconnect", function(peer){
//         $scope.$apply(function () {
//           $scope.peers.splice($scope.peers.indexOf(peer),1);
//         });
//       });
//       $scope.connect = function(room){
//         if($scope.current_room) throw new Error("You already have a room");
//         $scope.current_room = room;
//         comm.connect(room, {audio: false});
//       };
//       $scope.close = function(){
//         comm.leave();
//       };
//       $scope.roomEvent = function(e,value){
//         if(e.which !== 13) return;
//         $scope.connect(room.value);
//         room.value = "";
//       };
//       ele.find("button.close").bind("click",$scope.close);
//       ele.on('$destroy', $scope.close);
//       if(atts.room){
//         $scope.connect(atts.room);
//       }
//     }
//   };
// })
.service('authToken', function() {
    this.name='carine'
    this.login = function(){console.log(this.name, "is logged in")}
 	
})

.controller('LoggedIn', function($scope, $auth, $location, $auth, authToken/*toastr*/) {

	// $scope.authenticate = function(provider) {
	//       console.log("provider", provider);
	//       $auth.authenticate(provider);
	//   };
   $scope.login = function() {
      $auth.login($scope.user)
        .then(function() {
          // toastr.success('You have successfully signed in!');
          $location.path('/');
        })
        .catch(function(error) {
          // toastr.error(error.data.message, error.status);
        });
    };
    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function() {
          // toastr.success('You have successfully signed in with ' + provider + '!');
          $location.path('/');
        })
        .catch(function(error) {
          if (error.error) {
            // Popup error - invalid redirect_uri, pressed cancel button, etc.
            // toastr.error(error.error);
          } else if (error.data) {
            // HTTP response error from server
            // toastr.error(error.data.message, error.status);
          } else {
            // toastr.error(error);
          }
        });
    };
	// $scope.loggin = authToken.login();
});

angular.module('myApp').
factory('socket', ['$rootScope', function($rootScope) {
  var socket = io.connect("http://localhost:8080");

  return {
    on: function(eventName, callback){
      socket.on(eventName, callback);
    },
    emit: function(eventName, data) {
      socket.emit(eventName, data);
    }
  };
}]);

angular.module('myApp').controller('IndexController', function($scope, socket) {
  $scope.newCustomers = [];
  $scope.currentCustomer = {};

  $scope.join = function() {
    socket.emit('add-customer', $scope.currentCustomer);
  };

  socket.on('notification', function(data) {
    console.log("Just hear a notification from the server")

    $scope.$apply(function () {
      $scope.newCustomers.push(data.customer);
    });
  });
});
