angular.module('myApp')
	.controller('FutureSkillsController', ['$scope','profileData', 'Account', function($scope, profileData, Account){
		$scope.profile;
	var account = Account.getUserDisplayName()
	profiledata.findUser({user:account}).then(function(results){
	  $scope.profile = results.data.github
	  console.log('these are the results', results.data.github)
	  })

		$scope.add = function(){
			profileData.futureSkills({github: $scope.profile, python: $scope.python, java: $scope.java, swift: $scope.swift, android: $scope.android, ruby: $scope.ruby})
		}

	}])
