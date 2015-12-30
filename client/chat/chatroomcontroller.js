angular.module('myApp')
	.controller('ChatRoomController', ['$scope', 'Account', 'socket', 'profiledata', function($scope, Account, socket, profiledata){
		
		$scope.roomname
		 
		// $scope.username = Account.getProfile()
		// $scope.enter = function(name){
		// 	$scope.roomname = name
		// 	socket.emit('/createroom', {roomname: $scope.roomname, creator: $scope.username})
		//     $scope.newName = " "
		// };

		var account = Account.getUserDisplayName()

		// console.log('you are in her', account)

		// profiledata.findUser({user:account}).then(function(results){
		// 	console.log('these are teh resulst', results)
		// })

	socket.on('roomlist', function(data){
			console.log('this is data in roomlist', data)
	})
	$scope.findUser = function (){
		profiledata.findUser({user:account}).then(function(results){
			$scope.roomname = results.data.chatroom
			console.log('these are the results', $scope.roomname)
			})
	}

$scope.findUser()
		// setTimeout(function() {
		// 	console.log('$scope.roomname', $scope.roomname)
		// },5000 );

	
		
			socket.on('/roomcreated', function(data){
				console.log('this the is the room created', data)
			})


	}])
