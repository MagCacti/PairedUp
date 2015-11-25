angular.module('myApp', [
	'ui.router',
	'ui.ace'
])
.config( function($stateProvider, $urlRouterProvider, $locationProvider){

	$urlRouterProvider.otherwise('/signup');

	$stateProvider
		.state('signup', {
			url: '/signup',
			templateUrl: 'app/auth/signup/signup.html'
		})
		.state('mentee', {
			url: '/mentee',
			templateUrl: 'app/auth/signup/menteesignup.html'
		})
		.state('mentor', {
			url: '/mentor',
			templateUrl: 'app/auth/signup/mentorsignup.html'
		})

		.state('login', {
			url: '/login',
			templateUrl: 'app/auth/login/login.html',
			controller: 'LoggedIn'
		})
		.state('home', {
			url: '/home',
			templateUrl: 'app/home/home.html'
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
			templateUrl: 'app/codeshare/codeshare.html'
		})

})


.service('authToken', function() {
    this.name='carine'
    this.login = function(){console.log(this.name, "is logged in")}
 	
})

.controller('LoggedIn', function($scope, authToken) {
	$scope.loggin = authToken.login();
})