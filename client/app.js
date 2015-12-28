angular.module('myApp', [
	'ui.router',
	'ui.ace',
	'ui.bootstrap',
  'btford.socket-io',
  'xeditable'
  // 'myApp.services',
  // 'myApp.current'
])

.config(function($stateProvider, $urlRouterProvider, $locationProvider){

	$stateProvider
	
		.state('login', {
			url: '/login',
      template: 'you need to log back in'
			// controller: 'NavbarController'
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

      .state('profile.currentskills', {
        url: '/currentskills',
        templateUrl: 'userprofile/currentskills.html',
        controller: 'CurrentSkillsController'
      })
      .state('profile.futureskills', {
        url: '/futureskills',
        templateUrl: 'userprofile/futureskills.html',
        controller: 'FutureSkillsController'
      })

       .state('profile.summary', {
        url: '/summary',
        templateUrl: 'userprofile/summary.html',
        controller: 'SummaryController'
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
      controller: 'ChatController'
    })
    .state('chat.room', {
      url: '/chatroom',
      templateUrl: 'chat/chatroom.html',
      controller: 'ChatRoomController'
    })

	$urlRouterProvider.otherwise('/');

})

.controller('LoginController', function($scope,$location, $http) {


})

Object.setPrototypeOf = Object.setPrototypeOf || function(obj, proto) {
  obj.__proto__ = proto;
  return obj;
};
