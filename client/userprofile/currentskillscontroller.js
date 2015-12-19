angular.module('myApp.current', [])
  .controller('CurrentSkillsController', ['$scope','profiledata', function($scope, profiledata){
  	$scope.currentskills = profiledata.skills
  	console.log('this is the Account data', $scope.currentskills);
  	// $scope.currentskills = profiledata.skills
  	// $scope.currentskills = userdata.skills;

  	$scope.add = function(){	
  		profiledata.create({node:$scope.node}, {angular:$scope.angular}, 
  			{html:$scope.html}, {css:$scope.css}, {jquery:$scope.jquery})
  		console.log('this is currentskills', $scope.currentskills)
  	}

  }])