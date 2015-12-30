angular.module('myApp')
	.controller('ChatController', ['$scope', '$http', 'socket', '$filter', 'Account', function($scope, $http, socket, $filter, Account){
		$scope.toUsername;
		$scope.joinedRoom;
		$scope.allChats;

        // $scope.date = $filter('date')(new Date(), 'MM/dd/yyyy h:mma');
 		socket.on('composeToUser', function(data){
 			console.log('this is from the composeToUser', data)
 			$scope.$apply(function(){
 				$scope.toUsername = data.toUser
 			})
 		})
 		console.log('this the toUsername', $scope.toUsername)
         $scope.username = Account.getUserDisplayName();
	    socket.on("publish message", function(data) {
	    	console.log('this is the published message', data)
	        //Angular was not interacting inside socket well. So the function apply was needed to smooth over the bugs.
	        $scope.$apply(function(){
	            //store the message in the list array. Thus rendering it on the page, thanks to Angular's two way data binding.
	        	// console.log('this is data', data)
	        	//data comes from mongo and returns an array of objects
	        	$scope.allChats = data.messages;
					        
	        });
	    });

	    socket.on('joincomplete', console.log('thiis is from joincomplete'))
	    socket.on('replychat', function(data){
	    	$scope.$apply(function(){
 				$scope.toUsername = data.chatwith
 				$scope.joinedRoom = data.joinedroom
 			})
	    })

	    	console.log('Joined rooms', $scope.joinedRoom)
	    // socket.emit
	    //When someone clicks the submit button for the template chat.
	    $scope.submit = function() {
	        //check if there is text in the box.
	        if ($scope.text) {
	            //emit a new message with the text data. Will store this in the database. 
	             socket.emit('new message', {text: $scope.text, date: $filter('date')(new Date(), 'MM/dd/yyyy h:mma'), fromUser: $scope.username, toUser: $scope.toUsername, joinedroom: $scope.joinedRoom});
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