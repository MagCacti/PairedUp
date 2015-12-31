angular.module('myApp')
	.controller('ChatController', ['$scope', '$http', 'socket', '$filter', 'Account', '$stateParams', function($scope, $http, socket, $filter, Account, $stateParams){
		$scope.toUsername;
		$scope.joinedRoom;
		$scope.allChats;
		$scope.toUser;
		$scope.fromUser;
		$scope.allMsg
		$scope.otherRoom



		socket.on('savedroom', function(data){
			console.log('from saved room',data)
		})

        // $scope.date = $filter('date')(new Date(), 'MM/dd/yyyy h:mma');
 		socket.on('composeToUser', function(data){
 			console.log('this is from the composeToUser', data)
 			$scope.$apply(function(){
 				$scope.toUsername = data.toUser.displayName
 				$scope.toUser = data.toUser
 				$scope.fromUser = data.toUser
 				$scope.joinedRoom = data.roomname
 				$scope.otherRoom = data.othername
 			})
 		})
 		console.log('this the toUsername', $scope.toUsername)
         $scope.username = Account.getUserDisplayName();
	    socket.on("publish message", function(data) {
	    	console.log('this is the published message', data)
	        $scope.$apply(function(){
	        	$scope.allChats = data.messages;	        
	        });
	    });

	    socket.on('updatechat', function(data){
	    	console.log('the updated chate', data)
	    	$scope.$apply(function(){
	    		$scope.allMsg = data
	    	})

	    })

	    socket.on('joincomplete', console.log('thiis is from joincomplete'))

	    	console.log('Joined rooms', $scope.joinedRoom)
	    // socket.emit
	    //When someone clicks the submit button for the template chat.
	    $scope.submit = function() {
	        //check if there is text in the box.
	        if ($scope.text) {
	            //emit a new message with the text data. Will store this in the database. 
	             socket.emit('new message', {text: $scope.text, date: $filter('date')(new Date(), 'MM/dd/yyyy h:mma'), fromUser: $scope.username, toUser: $scope.toUsername, joinedroom: $scope.joinedRoom, otherroom: $scope.otherRoom});
	             // this is be sent to the socket.on('new messsages') on the server side.
	        }
	        $scope.text = ""
	    };
	}]);

//
	    //So this is currently function is still not working so we will leave it out for now
	    // $scope.sendMessage = function (fromUser, toUser) {
	    //   ///TODO: grab current user's name and the other user's name

	    //   //store that name in a object
	    //     var roomName = {
	    //         userWhoClicked: fromUser,
	    //         userWhoWasClicked: toUser
	    //     };
	    //   //socket emit chatRoom with this users name and the other users name
	    //     socket.emit("chatBox", roomName);
	    // };