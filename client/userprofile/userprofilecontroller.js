angular.module('myApp')
  .controller('ProfileController', function($scope, $http, $auth, Account) {
    $scope.getProfile = function() {
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

    $scope.updateProfile = function() {
      Account.updateProfile($scope.user)
        .then(function() {
          // toastr.success('Profile has been updated');
        })
        .catch(function(response) {
          // toastr.error(response.data.message, response.status);
        });
    };
    $scope.link = function(provider) {
      $auth.link(provider)
        .then(function() {
          // toastr.success('You have successfully linked a ' + provider + ' account');
          $scope.getProfile();
        })
        .catch(function(response) {
          // toastr.error(response.data.message, response.status);
        });
    };
    $scope.unlink = function(provider) {
      $auth.unlink(provider)
        .then(function() {
          // toastr.info('You have unlinked a ' + provider + ' account');
          $scope.getProfile();
        })
        .catch(function(response) {
          // toastr.error(response.data ? response.data.message : 'Could not unlink ' + provider + ' account', response.status);
        });
    };

    $scope.getProfile();
  });