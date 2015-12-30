angular.module('myApp')
	.controller('ContactController', ['$scope', 'profiledata', 'Account', 'Chat', 'socket', '$state', function($scope, profiledata, Account, Chat, socket, $state) {

		$scope.profile;
		$scope.allUsers = []; 
		  var account = Account.getUserDisplayName()
		  profiledata.findUser({user:account}).then(function(results){
		  	$scope.profile = results.data.displayName
		  	console.log('these are the results', $scope.profile)
		  })

		  profiledata.getAllUsers().success(function(data){
		  	for (var i=0; i<data.length; i++){
		  		$scope.allUsers.push(data[i])
		  	}
		  })

		  $scope.initChat = function (user){
		  	socket.emit('writeToUser', {toUser: user, fromUser:$scope.profile})
		  	//send a signal to the server that you want to make a room with the following 
		  	//two people.
		 //  	socket.emit('makeroom', {fromUser: $scope.profile, toUser: user})
		 //  	socket.emit(user, 'we created the chat on the server')
		 //  	console.log('this is from initchat', user)
			// socket.on('update', function(data){
			// 	console.log('this is the updat socket', data )
			// })
			// $state.go('chat.rooms')
		  }
	}])