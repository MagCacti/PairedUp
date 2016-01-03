angular.module('myApp')
	.controller('HomeController', ['$scope', 'profiledata', 'Account', 'Chat', 'socket', '$state', function($scope, profiledata, Account, Chat, socket, $state) {
		$scope.profile;
		$scope.fromUser
		$scope.allUsers = []; 

		  var account = Account.getUserDisplayName()
		  profiledata.findUser({user:account}).then(function(results){
		  	$scope.profile = results.data.displayName
		  	$scope.fromUser = results.data
		  	console.log('these are the results', $scope.profile)
		  })
		$scope.allUsers= []; 
		profiledata.getAllUsers().success(function(data){
			for (var i=0; i<data.length; i++){
				$scope.allUsers.push(data[i])

			}
		})
		$scope.initChat = function (user){
			socket.emit('writeToUser', {toUser: user, fromUser:$scope.fromUser})
			$state.go('chat')
		}

	}])