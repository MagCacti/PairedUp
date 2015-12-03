angular.module('myApp', [
	'ui.router',
	'ui.ace',
	'ui.bootstrap',
	'myApp.codeshare'
])
.config( function($stateProvider, $urlRouterProvider, $locationProvider){

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

})


.service('authToken', function() {
    this.name='carine'
    this.login = function(){console.log(this.name, "is logged in")}
 	
})

.controller('LoggedIn', function($scope, $http, authToken) {
	console.log('inside the LoggedIn controller');
	//testing a get request to server.
	$http.get('http://localhost:8000')
	//Get request worked
	.then(function(response){
		console.log("response from server", response)
	},//Get request did not work
	function(error){
			console.log("error message", error);
	});
//the second argument here is the data we send. It needs to be a object.
	$http.post('http://localhost:8000/login', {name:'Kristina'})
	//Get request worked
	.then(function(response){
		console.log("response from server for post", response)
	},//Get request did not work
	function(error){
			console.log("error message", error);
	});
	$scope.loggin = authToken.login();
})