angular.module('myApp')
  .controller('CurrentSkillsController', ['$scope','profiledata', 'Account', function($scope, profiledata, Account){
    
    $scope.currentskills = profiledata.skills;
    $scope.profile;

    // var account = Account.getUserDisplayName();
    // profiledata.findUser({user:account}).then(function(results){
    //   $scope.profile = results.data.github;
    // })

    Account.getProfile().success(function(data){
    $scope.profile = data.profile.github
    console.log('this is the data.profile:', data.profile)
  })

    $scope.add = function(){
      profiledata.addSkills({github: $scope.profile, node:$scope.node, angular:$scope.angular, 
        html:$scope.html, css:$scope.css, java:$scope.java, swift:$scope.swift, go:$scope.go, python:$scope.python, ruby:$scope.ruby})
    }

  }]);
