angular.module('myApp')
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



.controller('CodeShareController', ['$scope','$http', '$state','$window','socket','Account', '$log', 'profiledata', function($scope, $http, $state, $window,  socket, Account, $log, profiledata){
  //where the documents that are added are being saved. 
  $scope.toUsername;
  $scope.joinedRoom;
  $scope.allChats;
  $scope.toUserInfo;
  $scope.fromUser;
  $scope.allMsg
  $scope.otherRoom
  $scope.profile;
  $scope.fromUser
  $scope.allUsers = []; 
  // $scope.title = 'untitled'
// >>>>>>> b8bba24f5011b92a9e6e9ab5c8110a8db93b1a64
  $scope.filesList = [];
  $scope.id = 0;
  $scope.removeid = 0;
  $scope.modes = ['Scheme', 'XML', 'Javascript', 'HTML', 'Ruby', 'CSS', 'Curly', 'CSharp', 'Python', 'MySQL'];
  $scope.mode = $scope.modes[1];
  var coderoom = $scope.joinedRoom
  
  //import all users similarly to how users are imported in the home controller


  ///////////////////////////////////////////////////////////////////////////
  ////Imported Contacts list
  //////////////////////////////////////////////////////////////////////////

  var account = Account.getUserDisplayName()
  profiledata.findUser({user:account}).then(function(results){
      $scope.profile = results.displayName
      $scope.fromUser = results
      console.log('these are the results', $scope.profile)
  });
  
  profiledata.getAllUsers().success(function(data){
    for (var i=0; i<data.length; i++){
      $scope.allUsers.push(data[i])

    }
  });

  $scope.initChat = function (user){
    socket.emit('writeToUser', {toUser: user, fromUser:$scope.fromUser})
    $state.go('chat.contacts')
  };

  $scope.initSharing = function(user) {
    console.log("Name", user);
    $scope.id++;
    socket.emit("startLiveEditing", {toName: user, fromName: Account.getUserDisplayName()});
    var total = $scope.id + $scope.removeid;
    socket.emit('startsharing', {toUser: user, fromUser:$scope.fromUser, id: total, title: $scope.title, code: $scope.aceModel, mode: $scope.mode })
  };

  ///////////////////////////////////////////////////////////////////////////
  ////End - Imported Contacts list 
  //////////////////////////////////////////////////////////////////////////


  if (Account.getCheckIfLoggedOut()){

  }

  $scope.textInEditor = $scope.aceModel;
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
      ///////////////////////////////////////////////////////////////////////////
      ////Codesharing Functions
      //////////////////////////////////////////////////////////////////////////
  //     socket.on('startdoc', function(data){
  //       console.log('these are the new docs', data)
  //     })

  //     socket.on('allDocs', function(data){
  //       console.log('these are all the documents', data)
  //       $scope.$apply(function(){
  //         $scope.allDocs = data  
  //       })

  //     })

  //     socket.on('publishdocuments', function(data){
  //       console.log('this is the published document data', data)
  //       $scope.$apply(function(){
  //         $scope.toUsername = data.toUser.displayName
  //         $scope.toUser = data.toUser.displayName
  //         $scope.fromUser = data.toUser
  //         $scope.joinedRoom = data.roomname
  //         $scope.textInEditor = data.code
  //         $scope.title = data.title
  //         $scope.mode = data.mode
  //         $scope.doc = data
  //       })

  //       var sessionDoc = _ace[1].getSession().getDocument();
  //       if ($scope.textInEditor !== sessionDoc.getValue() ) {
  //         //setting $scope.textInEditor equal to the text in the document
  //         $scope.textInEditor = sessionDoc.getValue();
  //          //send a signal with the title from the document and the text from the document. 
  //       }

  //       socket.emit(coderoom, {code: $scope.textInEditor, title:$scope.title, mode: $scope.mode})

  //     })
  //     socket.on('notification', function(data){
  //       console.log('this is returned once you start a codeshare', data)

  //       $scope.$apply(function(){
  //         $scope.toUsername = data.toUser.displayName
  //         $scope.toUser = data.toUser.displayName
  //         $scope.fromUser = data.toUser
  //         $scope.joinedRoom = data.roomname
  //         $scope.textInEditor = data.code
  //         $scope.title = data.title
  //         $scope.mode = data.mode
  //       })

  //     })

  //     // socket.on('allDocs', function(data){
  //     //   console.log('the data from all docs', data)
  //     //   $scope.$apply(function(){
  //     //   $scope.doc = data
  //     //   var allUsers = $scope.allUsers
  //     //   for(var i = 0; i < allUsers.length; i++){
  //     //     console.log('this is the current user', $scope.profile)
  //     //     if((allUsers[i].displayName === data[0].sharedWith) && ($scope.profile === data[0].displayName))
  //     //       allUsers[i].docs = data
  //     //   }
  //     //    })
  //     //   console.log('this is what happends to allUsers', $scope.allUsers)
  //     // })

      
  //     socket.emit('writeToShare', {coderoom: $scope.joinedRoom, title: $scope.title, textFromDoc: $scope.textInEditor});
  //     socket.on('wordsconnect', function(data){
  //       $scope.textInEditor = data.textFromDoc
  //       console.log('this is from words connect', data)
  //       if ($scope.textInEditor !== sessionDoc.getValue() ) {
  //         //setting $scope.textInEditor equal to the text in the document
  //         $scope.textInEditor = sessionDoc.getValue();

  //          //send a signal with the title from the document and the text from the document. 
            
  //       }
  //     })
  //   },
  // };

      ///////////////////////////////////////////////////////////////////////////
      ////End - Codesharing Functions
      //////////////////////////////////////////////////////////////////////////
  //listening to when the server emits the file's data.
  // socket.on("fileData", function( data) {
  //   //$scope.textInEditor will be set to the text (called data) from the file
  //  $scope.textInEditor = data;
  //  //set the documents value to the text from the server.
  //  $scope.doc.setValue($scope.textInEditor);
  // });

  $scope.aceModel = ';; Scheme code in here.\n' +
    '(define (double x)\n\t(* x x))\n\n\n' +
    '<!-- XML code in here. -->\n' +
    '<root>\n\t<foo>\n\t</foo>\n\t<bar/>\n</root>\n\n\n' +
    '// Javascript code in here.\n' +
    'function foo(msg) {\n\tvar r = Math.random();\n\treturn "" + r + " : " + msg;\n}';
 
  

 //file types to add to the document name. 
  $scope.fileTypes = {'Scheme': '.sch', 'XML' : '.xml', 'Javascript': '.js', 'HTML': '.html' , 'Ruby': '.rb' , 'CSS': '.css' , 'Curly': '.curly' , 'CSharp': '.csharp' , 'Python': '.py' , 'MySQL': '.sql' };
//retrieving all the files if the user is logged in. 
  if (Account.getCheckIfLoggedOut() === 'false') {
      $http.post('/retrievingDocumentsForUser', {displayName: Account.getUserDisplayName(), code: $scope.aceModel})
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
    $http.post('/savingDocumentsToDatabase', {id: total, title: ($scope.title + $scope.fileTypes[$scope.mode]), mode: $scope.mode, displayName: Account.getUserDisplayName(), code: $scope.aceModel});  
    
    $scope.title = '';
    $scope.aceModel = '';
  };
//update a document
  $scope.update = function(id){
    // var index = selectId(id);
// <<<<<<< HEAD
//     var index = selectId($scope.IdOfCurrentDoc);  
//     console.log("Update going through");
// =======
    var index = selectId($scope.idOfCurrentDoc);
// >>>>>>> b8bba24f5011b92a9e6e9ab5c8110a8db93b1a64
    $scope.filesList[index].title = $scope.title;
    $scope.filesList[index].code = $scope.aceModel;
    $scope.filesList[index].mode = $scope.mode;
    $scope.title = '';
    $scope.aceModel = '';
// <<<<<<< HEAD
//     $scope.IdOfCurrentDoc = null; 

// =======
    $scope.idOfCurrentDoc = null;
// >>>>>>> b8bba24f5011b92a9e6e9ab5c8110a8db93b1a64

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
// <<<<<<< HEAD
//     $scope.IdOfCurrentDoc = id;  

//   };

//   $scope.delete = function(id){
//     // var index = selectId(id);
//     var index = selectId($scope.IdOfCurrentDoc);
// =======
    $scope.idOfCurrentDoc = id;
  };

  $scope.delete = function(id){
    var index = selectId(id);
    var index = selectId($scope.idOfCurrentDoc);
// >>>>>>> b8bba24f5011b92a9e6e9ab5c8110a8db93b1a64
    var item = $scope.filesList[index];
    console.log("$scope.filesList", $scope.filesList, 'id', id, 'index', index);
    var store = $scope.filesList[$scope.removeid];
    $http.post('/deleteDocumentsForUser', {displayName: Account.getUserDisplayName(), title: item.title, id:item.id}).then(function(result) {
    }).then(function() {
      $scope.id = 0; 
      $scope.filesList = [];
      $http.post('/retrievingDocumentsForUser', {displayName: Account.getUserDisplayName(), code: $scope.aceModel})
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

  $scope.endLiveCodeShare = function() {
    Account.setTitle(null);
    $window.location.reload();
  };
  $scope.liveCodeShare = function() {
    socket.emit("startLiveEditing", {toName: $scope.text, fromName: Account.getUserDisplayName()});
  };
  
  socket.on("mediumLiveEdit", function(data) {
    //if there names match the ones given from the medium live edit
    if (Account.getUserDisplayName() === data.toName || Account.getUserDisplayName() === data.fromName){
      // confirm whether both want to go to the codeshare
      var goToCodeShare = $window.confirm("Go to live Code Share?");
      //if they both say yes. 
      if (goToCodeShare) {
        //set title to a value 
        Account.setTitle(data.toName + data.fromName);
        //state.go codeshare
        $window.location.reload();
      }    
    } 
  });

  if (Account.getTitle() && Account.getTitle() !== 'null') {
    $scope.title = Account.getTitle();
    $scope.add();
    var idOfTitle;
    for (var i = 0; i < $scope.filesList.length; i++) {
      var title = $scope.filesList[i].title.split('.')[0];
      if (title === Account.getTitle()) {
        idOfTitle = $scope.filesList[i].id;
      }
    }
    $scope.edit(idOfTitle);
    $scope.shareWith();
  }
  $scope.items = [
    'The first choice!',
    'And another choice for you.',
    'but wait! A third!'
  ];

  $scope.status = {
    isopen: false
  };

  $scope.toggled = function(open) {
    $log.log('Dropdown is now: ', open);
  };

  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };

}]);
