angular.module('myApp')
	.controller('ChatController', ['$scope', '$http', 'socket', '$filter', 'Account', 'Notification', function($scope, $http, socket, $filter, Account, Notification){
		$scope.toUsername;
		$scope.joinedRoom;
		$scope.allChats;
		$scope.toUser;
		$scope.fromUser;
		$scope.allMsg
		$scope.otherRoom
        $scope.username = Account.getUserDisplayName();

		socket.on('savedroom', function(data){
			console.log('from saved room',data)
		});

 		socket.on('composeToUser', function(data){
 			$scope.$apply(function(){
 				$scope.toUsername = data.toUser.displayName
 				$scope.toUser = data.toUser.displayName
 				$scope.fromUser = data.toUser
 				$scope.joinedRoom = data.roomname
 				$scope.otherRoom = data.othername
 			});
 		});

	    socket.on("publish message", function(data) {
	        $scope.$apply(function(){
	        	$scope.allChats = data;	        
	        });
	    });

	    socket.on('updatechat', function(data){
	    	$scope.$apply(function(){
	    		$scope.allMsg = data
	    	});
	    });

	    $scope.submit = function(e) {
	        //check if there is text in the box.
	        if (e.keyCode === 13 && $scope.text) {
	        	Notification('Primary notification'); 
	            socket.emit('new message', {text: $scope.text, date: $filter('date')(new Date(), 'MM/dd/yyyy h:mma'), fromUser: $scope.username, toUser: $scope.toUsername, joinedroom: $scope.joinedRoom, otherroom: $scope.otherRoom});
	        }
	        $scope.text = "";
	    };
	}]);