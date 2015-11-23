angular.module('myApp', [
	'ui.router'
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
			templateUrl: 'app/auth/login/login.html'
		})
		// .state('home', {
		// 	url: '/home',
		// 	templateUrl: 'app/home/home.html'
		// })





})