angular.module('myApp', [
	'ui.router',
	'ui.ace',
	'ui.bootstrap',
	'myApp.codeshare',
   //for client side sockets
  'btford.socket-io'

])
.config(function($stateProvider, $urlRouterProvider, $locationProvider){

	$stateProvider
	
		.state('login', {
			url: '/login',
			templateUrl: 'auth/login/login.html',
			controller: 'LoginController'
		})
    .state('logout', {
      url: '/logout',
      template: null,
      controller: 'LogoutController'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'userprofile/userprofile.html',
      controller: 'ProfileController'
    })

		.state('codeshare', {
			url: '/codeshare',
			templateUrl: 'codeshare/codeshare.html',
			controller: 'CodeShareController'
		})
    .state('codeshare.room2', {
      url: '/room/:roomId',
      templateUrl: 'codeshare/room.html',
      controller: 'RoomCtrl'
    })
    .state('codeshare.room', {
      url: '/room',
      templateUrl: 'codeshare/room.html',
      controller: 'RoomCtrl'
    })
    .state('chat', {
      url: '/chat',
      templateUrl: 'chat/chat.html',
      controller: 'ExampleController'
    })

	$urlRouterProvider.otherwise('/');

})

.controller('LoginController', function($scope,$location, $http) {


})

/*

  Nav Bar Controller

*/

.controller('NavbarController', function($scope) {
  
})



.factory('Account', function($http) {

    return {
      getProfile: function() {
        console.log('inside the factory-------------');
          return $http.get('/account')
        // .then(function(req, res){
        //   console.log('this is a successful callback of /account', res);
        //   console.log('this is a successful callback of /account for req', req);
        //   console.log(typeof req);
        //   // var test = JSON.parse(req);
        //   // console.log(test);
        //   console.log('this is req.data.whatever', req.data.profile.username)
        //   // $scope.username = req.data.profile.username;
        // })
      
      },
      updateProfile: function(profileData) {
        return $http.put('/api/me', profileData);
      }
    };
})

.factory('socket', ['$rootScope', function($rootScope) {
    //A socket connection to our server.
  var socket = io.connect("http://localhost:8080");
  return {
    //listen to events.
    on: function(eventName, callback){
      socket.on(eventName, callback);
    },
    //give off signals to anyone who might be listening (such as the server).
    emit: function(eventName, data) {
      socket.emit(eventName, data);
    }
  };
}])
//example chat for front end. 
.controller('ExampleController', ['$scope', '$http', 'socket', function($scope, $http, socket){
      //Where the text is held for the template chat. The template chat is not persisting data.
    $scope.list = [];
      //Listen when the server emits publish message and preform the a callback. This is to simulate going back to the server and have the info come back, as we will on the fully functional chat. 
    socket.on("publish message", function(data) {
        //set $scope.text to the text from the messages we received from the server (and database (?)).
        $scope.text = data.text;
        //Angular was not interacting inside socket well. So the function apply was needed to smooth over the bugs.
        $scope.$apply(function(){
            //store the message in the list array. Thus rendering it on the page, thanks to Angular's two way data binding.
            $scope.list.push(data.text); 
        
        });
    });

    //When someone clicks the submit button for the template chat.
    $scope.submit = function() {
        //if there is text in the box.
        if ($scope.text) {
            //emit a new message with the text data. Will store this in the database. 
            socket.emit('new message', {text: $scope.text});
        }
    };
}]);

Object.setPrototypeOf = Object.setPrototypeOf || function(obj, proto) {
  obj.__proto__ = proto;
  return obj;
};