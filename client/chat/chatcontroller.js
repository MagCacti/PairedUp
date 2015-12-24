angular.module('myApp')
	.controller('ChatController', ['$scope', '$http', 'socket', '$filter', 'Account', 'Chat', function($scope, $http, socket, $filter, Account, Chat){
	      //Where the text is held for the template chat. The template chat is not persisting data.
	    $scope.list = [];
        $scope.date = $filter('date')(new Date(), 'MM/dd/yyyy h:mma');
        // var date = $scope.date
        $scope.username = Account.getLogInData()
	      //Listen when the server emits publish message and preform the a callback. This is to simulate going back to the server and have the info come back, as we will on the fully functional chat. 
	    socket.on("publish message", function(data, other) {
	        //set $scope.text to the text from the messages we received from the server (and database (?)).
	        $scope.text = data.text;
	        // var username = $scope.username 

	        // console.log('this is username', $scope.username)
	        console.log('this is data', data)
	        //Angular was not interacting inside socket well. So the function apply was needed to smooth over the bugs.
	        $scope.$apply(function(){
	            //store the message in the list array. Thus rendering it on the page, thanks to Angular's two way data binding.
	            $scope.list.push(data.text, $scope.date); 
	        
	        });
	    });

	    var incomingChat = []
	    $scope.name = 
	    $scope.postdate;
	    $scope.msg = Chat; 
	    $scope.showChat = Chat.getChat().success(function(data){
	    	console.log('this is the showChat data', data)
	    	for (var i=1; i<data.length; i++){
	    		data[i].displayName
	    	}
	    	return data;
	    })
	    $scope.chat = Chat.messages

	    // console.log('this is the showChat', showChat)


	    $scope.sendMessage = function (fromUser, toUser) {
	      ///TODO: grab current user's name and the other user's name

	      //store that name in a object
	        var roomName = {
	            userWhoClicked: fromUser,
	            userWhoWasClicked: toUser
	        };
	      //socket emit chatRoom with this users name and the other users name
	        socket.emit("chatBox", roomName);
	    };

	    //When someone clicks the submit button for the template chat.
	    $scope.submit = function() {
	        //if there is text in the box.
	        Chat.addMessage({text: $scope.text, date: $scope.date, username: $scope.username})
	        if ($scope.text) {
	            //emit a new message with the text data. Will store this in the database. 
	            socket.emit('new message', {text: $scope.text});
	        }
	    };
	}]);