angular.module('myApp')
	.controller('ContactController', ['$scope', 'profiledata', 'Account', 'Chat', 'socket', '$state', function($scope, profiledata, Account, Chat, socket, $state) {
		console.log('we in this bitch')

		$scope.profile;
		$scope.userSkills=[];
		$scope.futureSkills = []
		  Account.getProfile().success(function(data){
		    $scope.profile = data.profile.displayName
			$scope.userSkills.push(data.profile.skills)
			for(var keys in data.profile.futureskills){
				console.log
				$scope.futureSkills.push(keys)
			}
			// $scope.futureSkills = data.profile.futureskills
		    // console.log('this is the data.profile:', data)
		  })
		  $scope.allUsers= []; 
		  profiledata.getAllUsers().success(function(data){
		  	for (var i=0; i<data.length; i++){
		  		$scope.allUsers.push(data[i])

		  	}
		  })

		  $scope.initChat = function (user){
		  	//send a signal to the server that you want to make a room with the following 
		  	//two people.
		  	socket.emit('makeroom', {fromUser: $scope.profile, toUser: user})
		  	socket.emit(user, 'we created the chat on the server')
		  	console.log('this is from initchat', user)
			socket.on('update', function(data){
				console.log('this is the updat socket', data )
			})
			$state.go('chat.rooms')
		  }
		  console.log("this is all users", $scope.allUsers)

	}])