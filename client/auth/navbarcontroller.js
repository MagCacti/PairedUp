angular.module('myApp')
	.controller('NavbarController', function($scope, $http, $window, Account) {
	  console.log("This is the document cookie", document.cookie);
	  $scope.clickedLogin = function() {
	    Account.setLoggedOutData(false);
	    Account.setData(true);
	    Account.setCheckingIfLogInData(2);
	    // $scope.isAuthenticated();
	  };
	  $scope.goingToLogOut = function() {
	    Account.setLoggedOutData(true);
	  };
	  $scope.isAuthenticated = function() {
	    return $http.get('/checkIfLoggedIn').then(function(response){
	      console.log('this is isAuthenticated', response, 'response.data', response.data.loggedIn)
	      return response.data.loggedIn;
	  });
	  };  
	  // $scope.isAuthenticated();
	})