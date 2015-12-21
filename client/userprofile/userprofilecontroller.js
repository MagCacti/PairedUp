angular.module('myApp')
  .controller('ProfileController', function($scope, $http, Account) {
    $scope.getProfile = function() {
      Account.getProfile()
        .then(function(response) {
          console.log('inside profile controller------')
          console.log('this is the response', response);
          $scope.user = response.data.profile;
        })
        .catch(function(response) {
          
        });
    };

    $scope.updateProfile = function() {
      Account.updateProfile($scope.user)
        .then(function() {
          
        })
        .catch(function(response) {
          
        });
    };
    
    $scope.getProfile();
  });