angular.module('myApp', [
	'ui.router'
])
.config( function($stateProvider, $urlRouterProvider, $locationProvider){

	$urlRouterProvider.otherwise('/auth');

	$stateProvider
		.state('auth', { //this is the nav bar and at the end is a view for everything else
			url: '/auth',
			views: {
				'': {templateUrl: 'app/auth/signin.html'},
				'signUp@auth': {
					templateUrl: 'app/auth/signup/signup.html'
				}
			}
		})
		// .state('auth.signup', {
		// 	url: '/signup',
		// 	templateUrl: 'app/auth/signup/signup.html'
		// })
		// .state('auth.mentorsignup', {
		// 	url: '/mentor',
		// 	templateUrl: 'app/auth/signup/mentorsignup.html'
		// })
		// .state('auth.menteesignup', {
		// 	url: '/mentee',
		// 	templateUrl: 'app/auth/signup/menteesignup.html'
		// })
		.state('auth.login', {
			url: '/login',
			templateUrl: 'app/auth/login/login.html'
		})
		// .state('home', {
		// 	url: '/home',
		// 	templateUrl: 'app/home/home.html'
		// })





})