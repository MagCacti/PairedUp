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
])
.config(function($stateProvider, $urlRouterProvider, $locationProvider, $authProvider){

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
		.state('codeshare', {
			url: '/codeshare',
			templateUrl: 'codeshare/codeshare.html',
			controller: 'CodeShareController'
		})

	$urlRouterProvider.otherwise('/');

	// $authProvider.github({
      	
 //    	});
	$authProvider.github({
	  url: 'https://paired-up.herokuapp.com', 
	  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    clientId: "6ffd349ee17a258a13ff",
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

.controller('LoggedIn', function($scope, $auth, $location, $auth, authToken/*toastr*/, $http) {


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
    $scope.authenticate = function() {
      $auth.authenticate('github')
        .then(function(response) {
          console.log('this...', response);
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
});

