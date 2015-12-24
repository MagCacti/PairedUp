angular.module('myApp.codeshare', [ ])
//factory will hold socket info
.factory('socket', ['$rootScope', function($rootScope) {
    //A socket connection to our server.
  var socket = io.connect("http://localhost:8080");
  return {
    //listen to events.
    on: function(eventName, callback){
      socket.on(eventName, callback);
    },
    //give off signals to anyone who might be listening (such as the server).
    emit: function(eventName, data) {
      socket.emit(eventName, data);
    }
  };
}])

.controller('CodeShareController', ['$scope','$http', '$state','socket','Account', function($scope, $http, $state, socket, Account){
  //where the documents that are added are being saved. 
  $scope.filesList = [];
  $scope.id = 0;
  $scope.removeid = 0;
  $scope.modes = ['Scheme', 'XML', 'Javascript', 'HTML', 'Ruby', 'CSS', 'Curly', 'CSharp', 'Python', 'MySQL'];
  $scope.mode = $scope.modes[0];
  if (Account.getLoggedOutData()){

  }
  //I believe the line below to be unnecessary now but not sure. 
  // $http.get('/checkIfLoggedIn').then(function(response){
  //   console.log("response from checkIfLoggedIn", response);
  // });
  // var comm = new Icecomm('');

  //       comm.connect('test');

  //       comm.on('local', function(peer) {
  //         localVideo.src = peer.stream;
  //       });

  //       comm.on('connected', function(peer) {
  //         document.body.appendChild(peer.getVideo());
  //       });

  //       comm.on('disconnect', function(peer) {
  //         document.getElementById(peer.ID).remove();
  //       });
  //Will use to hold all the text in editor
  $scope.textInEditor;
  $scope.doc;
  $scope.aceOption = {
    mode: $scope.mode.toLowerCase(),
    onLoad: function (_ace) {
      $scope.modeChanged = function () {
          _ace.getSession().setMode("ace/mode/" + $scope.mode.toLowerCase());
          
      };
      //store the document of the session to a variable. 
      $scope.doc = _ace.getSession().getDocument();
     
    },
    //When someone changes the document (for example, typing in the document.)
    onChange: function(_ace) {
      //store the document of the session to a variable. 
      var sessionDoc = _ace[1].getSession().getDocument();
      //Was erroring without this if statement. Not sure why. 
      if ($scope.textInEditor !== sessionDoc.getValue() ) {
        //setting $scope.textInEditor equal to the text in the document
        $scope.textInEditor = sessionDoc.getValue();

         //send a signal with the title from the document and the text from the document. 
         socket.emit($scope.title, {title: $scope.title, textFromDoc: $scope.textInEditor});
        
      }
     
      //When a signal(called notification) is sent, then run the callback function.
      //This may have to be a general variable rather than a hardcoded 'notification'. Will probably be scope.title and some random string. Right now we will put notification
      socket.on('notification', function(data) {
        //data will be the information the server is sending.

        //if the text in the document is not the same as the user's version of the text in the editor.
        if ($scope.textInEditor !== data.textFromDoc){
          //if the title of the user is the same as the title of the other user(s).
          if ($scope.title === data.title) {
          //set the variable $scope.textInEditor to the text received from the server.
            $scope.textInEditor = data.textFromDoc;
            //change the user's document to reflect the other's typing. 
            sessionDoc.setValue($scope.textInEditor);
            
            }
        }
      });
    }
  };
  //listening to when the server emits the file's data.
  socket.on("fileData", function( data) {
    //$scope.textInEditor will be set to the text (called data) from the file
   $scope.textInEditor = data;
   //set the documents value to the text from the server.
   $scope.doc.setValue($scope.textInEditor);
  });

  $scope.aceModel = ';; Scheme code in here.\n' +
    '(define (double x)\n\t(* x x))\n\n\n' +
    '<!-- XML code in here. -->\n' +
    '<root>\n\t<foo>\n\t</foo>\n\t<bar/>\n</root>\n\n\n' +
    '// Javascript code in here.\n' +
    'function foo(msg) {\n\tvar r = Math.random();\n\treturn "" + r + " : " + msg;\n}';
 
  
//add a document

 //file types to add to the document name. 
  $scope.fileTypes = {'Scheme': '.sch', 'XML' : '.xml', 'Javascript': '.js', 'HTML': '.html' , 'Ruby': '.rb' , 'CSS': '.css' , 'Curly': '.curly' , 'CSharp': '.csharp' , 'Python': '.py' , 'MySQL': '.sql' };
//retrieving all the files if the user is logged in. 
  if (Account.getLoggedOutData() === 'false') {
      $http.post('/retrievingDocumentsForUser', {displayName: Account.getLogInData(), code: $scope.aceModel})
      .then(function(result) {
        for (var i = 0; i < result.data.length; i++) {
          $scope.id++;
          $scope.filesList.push(result.data[i]);
        }
      }, function(err) {
        console.log("there was an error");
      });
    }



  $scope.add = function(){
    $scope.id++;
    var total = $scope.id + $scope.removeid;
    $scope.filesList.push({id: total, title: $scope.title, code: $scope.aceModel, mode: $scope.mode});
    $scope.filesList[total - 1].title += $scope.fileTypes[$scope.mode];
    $http.post('/savingDocumentsToDatabase', {id: total, title: ($scope.title + $scope.fileTypes[$scope.mode]), mode: $scope.mode, displayName: Account.getLogInData(), code: $scope.aceModel});  
    
    $scope.title = '';
    $scope.aceModel = '';
  };
//update a document
  $scope.update = function(id){
    var index = selectId(id);
    $scope.filesList[index].title = $scope.title;
    $scope.filesList[index].code = $scope.aceModel;
    $scope.filesList[index].mode = $scope.mode;
    $scope.title = '';
    $scope.aceModel = '';

  };
//After OAuth is functional, research how to use another box for the question of who a user wants to share with. 
  $scope.shareWith = function(username) {
   //emiting a message to server called /create which will have the users join a room
    socket.emit('/create', {title:$scope.title});
    };

  $scope.edit = function(id){
    var index = selectId(id);
    var item = $scope.filesList[index];
    $scope.title = item.title;
    $scope.aceModel = item.code;
    $scope.mode = item.mode;
  };

  $scope.delete = function(id){
    var index = selectId(id);
    var item = $scope.filesList[index];
    var store = $scope.filesList[$scope.removeid];
    $http.post('/deleteDocumentsForUser', {displayName: Account.getLogInData(), title: item.title, id:item.id}).then(function(result) {
    }).then(function() {
      $scope.id = 0; 
      $scope.filesList = [];
      $http.post('/retrievingDocumentsForUser', {displayName: Account.getLogInData(), code: $scope.aceModel})
      .then(function(result) {
        for (var i = 0; i < result.data.length; i++) {
          $scope.id++;
          $scope.filesList.push(result.data[i]);
        }
      }, function(err) {
        console.log("there was an error");
      });


    });
    $scope.removeid = 0;
    $scope.id--;
    $scope.title = '';
    $scope.aceModel = '';
    

  };

  function selectId (id){
    for(var i = 0; i < $scope.filesList.length; i++){
      if($scope.filesList[i].id === id){
        return i;
      }
    }
  };


}]);
