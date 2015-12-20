angular.module('myApp')

  .controller('ProfileController', function($scope, $http, $auth, Account) {
    
    $scope.getProfile = function() { //this method gets invoked at the end of the controller.
      Account.getProfile()
        .then(function(response) {
          console.log('inside profile controller------')
          console.log('this is the response', response);
          $scope.user = response.data.profile;
        })
        .catch(function(response) {
          // toastr.error(response.data.message, response.status);
        });
    };

    $scope.getProfile();
  });