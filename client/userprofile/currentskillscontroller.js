angular.module('myApp')
  .controller('CurrentSkillsController', ['$scope','profiledata', 'Account', function($scope, profiledata, Account){
    $scope.currentskills = profiledata.skills;
    $scope.profile;

    var account = Account.getUserDisplayName()
    profiledata.findUser({user:account}).then(function(results){
      $scope.profile = results.data.github
      console.log('these are the results', results.data.github)
    })

    $scope.add = function(){
      profiledata.addSkills({github: $scope.profile, node:$scope.node, angular:$scope.angular, 
        html:$scope.html, css:$scope.css, jquery:$scope.jquery})
    }

  }]);
