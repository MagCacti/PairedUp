angular.module('myApp')
	.controller('LogoutController', ['$scope', '$http', '$state','$window','Account', function($scope, $http, $state, $window, Account){
	      delete $window.localStorage.UserDisplayName;
	      // $window.localStorage.loggedIn = 0;

	      // $window.localStorage.loggedOut = true;
	      // $Acount.setLoggedOutData(true);
	      // console.log("day");
	      $state.go('/');
	}])