angular.module('myApp')
.controller('SummaryController', ['$scope', 'Account', 'profiledata', 'documentData', function($scope, Account, profiledata, documentData) {

		//track skills section

		$scope.profile;
		$scope.userSkills=[];
		$scope.futureSkills = [];

		Account.getProfile().success(function(data){
			$scope.profile = data.profile.github;
			$scope.userSkills.push(data.profile.skills);

			for(var keys in data.profile.futureskills){
				$scope.futureSkills.push(keys);
			}
		});

		$scope.allUsers= []; 
		profiledata.getAllUsers().success(function(data){
			for (var i=0; i<data.length; i++){
				$scope.allUsers.push(data[i]);

				$scope.allUsers= []; 
				
				profiledata.getAllUsers().success(function(data){
					for (var i=0; i<data.length; i++){
						$scope.allUsers.push(data[i]);
					}
				});

				$scope.initChat = function (user){
				};

		//track docs section
		
		$scope.allDocs= []; 
		
		documentData.getAllDocs();

	}])
