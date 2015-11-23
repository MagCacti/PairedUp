angular.module('myApp', [
	'ui.router'
])
.config( function($stateProvider, $urlRouterProvider, $locationProvider){

	$urlRouterProvider.otherwise('/signup');

	$stateProvider
		.state('auth', {
			url: '/auth',
			templateUrl: 'app/auth/signin.html'
		})
		.state('signup', {
			url: '/signup',
			templateUrl: 'app/auth/signup/signup.html'
		})
		.state('auth.mentorsignup', {
			url: '/signup/mentor',
			templateUrl: 'app/auth/signup/mentorsignup.html'
		})
		.state('menteesignup', {
			url: 'auth/signup/mentee',
			templateUrl: 'app/auth/signup/menteesignup.html'
		})
		.state('login', {
			url: '/login',
			templateUrl: 'app/auth/login/login.html'
		})
		.state('home', {
			url: '/home',
			templateUrl: 'app/home/home.html'
		})





})