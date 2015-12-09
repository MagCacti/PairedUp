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

	// $authProvider.github({
      	
 //    	});
	$authProvider.github({
	  url: '/auth/github',
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
})//;

.factory('socket', ['$rootScope', function($rootScope) {
    //A socket connection to our server.
  var socket = io.connect("http://localhost:8080");
  return {
    //listen to events.
    on: function(eventName, callback){
      socket.on(eventName, callback);
    },
    join: function(room) {
      socket.join(room);
    } ,
    //give off signals to anyone who might be listening (such as the server).
    emit: function(eventName, data) {
      console.log("socket", socket);
      socket.emit(eventName, data);
    }
  };
}])
//example chat for front end. 
.controller('ExampleController', ['$scope','$http',/*'$watch',*/'socket', function($scope, $http,/*watch*/ socket){
      

      //Testing get data from file upload
      // $scope.getFileInfo = function() {
      //   console.log('Going through get file info function');
      //   $http.get('/testingGettingTextDocument').then(function(response) {
      //       console.log("response from server to client", response);
      //   })
      // }

      //end testing get data from file upload



    //My implementation of watch to fix the problem is not working. 
      $scope.list = [];
      // $scope.text = 'hello';
      socket.on("publish message", function(data) {
        //will display this data on the front end.
        console.log("Data.text", data.text);
        $scope.text = data.text;
        // $scope.$watch('list', function() {
        //     // if (data.text !== oldVal && $scope.text !== '') {
        //     //     $scope.list.push($scope.text);
        //     // }
        //     alert("Hi there.")
        // });
      $scope.$apply(function(){
        $scope.list.push(data.text); 
        
      });
            // $scope.render(data.text);
        // console.log("going through socket.on", "This is list", $scope.list);
      });

      // $scope.render = function(text){
      //   $scope.list.push(text);
      // }
      $scope.submit = function() {
        if ($scope.text) {

         console.log("Going through if statement")
         //emit a new message with the text data. Will store this in the database. 
          socket.emit('new message', {text: $scope.text});
          //listening to the signal the server will put up.
          // $scope.list.push($scope.text);
          // $scope.text = '';
        }
      };
    }]);