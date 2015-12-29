angular.module('myApp')
	.controller('ChatRoomController', ['$scope', 'Account', 'socket', function($scope, Account, socket){
		$scope.roomname = []

		// $scope.username = Account.getProfile()
		// $scope.enter = function(name){
		// 	$scope.roomname = name
		// 	socket.emit('/createroom', {roomname: $scope.roomname, creator: $scope.username})
		//     $scope.newName = " "
		// };
		socket.on('update-people', function(data){
			$scope.$apply(function(){
				console.log('update people', data)
				$scope.roomname.push(data);
			})
		})
		socket.on('roomList', function(data){
	
			console.log('this is the roomlist', data)
			
		})
		
			socket.on('/roomcreated', function(data){
				console.log('this the is the room created', data)
			})


	}])
