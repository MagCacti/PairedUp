angular.module('myApp')
	.controller('NavbarController', ['$scope', '$http', '$window', 'Account', '$rootScope', function($scope, $http, $window, Account, $rootScope) {
	  $scope.clickedLogin = function() {
	    Account.setCheckIfLoggedOut(false);
	    $rootScope.loggedIn = true;
	    Account.setChekIfActivelyLoggedIn(true);
	    Account.setCheckingIfLogInData(2);
	  };
	  $scope.goingToLogOut = function() {
	  	console.log('this is what happend')
	    Account.setCheckIfLoggedOut(true);
	  };

	  $scope.login = function (){
	  	console.log('This is working in NavbarController')
	  }

	  $scope.login();

	}]);