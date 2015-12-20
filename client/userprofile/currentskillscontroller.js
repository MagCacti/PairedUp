angular.module('myApp.current', [])
  .controller('CurrentSkillsController', ['$scope','profiledata', 'Account', function($scope, profiledata, Account){
  	$scope.currentskills = profiledata.skills

  	$scope.profile;
  	Account.getProfile().success(function(data){
  		$scope.profile = data.profile._id
  		console.log('this is the data.profile:', data.profile._id)
  	})

 

  	// $scope.currentskills = profiledata.skills
  	// $scope.currentskills = userdata.skills;

  	$scope.add = function(){
  			
  	console.log('this is the Account data', $scope.profile);
  		profiledata.addSkills($scope.profile, {node:$scope.node, angular:$scope.angular, 
  			html:$scope.html, css:$scope.css, jquery:$scope.jquery}).success(function(skill){
  		console.log('this is currentskills', $scope.currentskills)
  			
  			})
  	}

  }])