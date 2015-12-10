angular.module('myApp.codeshare', [ ])
//factory will hold socket info
.factory('socket', ['$rootScope', function($rootScope) {
    //A socket connection to our server.
  var socket = io.connect("https://paired-up.herokuapp.com");
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

.controller('CodeShareController', ['$scope','socket', function($scope, socket){
  console.log('inside the codesharecontroller');
  $scope.filesList = [];
  $scope.id = 0;
  $scope.removeid = 0;
  $scope.modes = ['Scheme', 'XML', 'Javascript', 'HTML', 'Ruby', 'CSS', 'Curly', 'CSharp', 'Python', 'MySQL'];
  $scope.mode = $scope.modes[2];

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

  $scope.aceOption = {
    mode: $scope.mode.toLowerCase(),
    onLoad: function (_ace) {
      $scope.modeChanged = function () {
          _ace.getSession().setMode("ace/mode/" + $scope.mode.toLowerCase());
      };
    },
    //When someone changes the document (for example, typing in the document.)
    onChange: function(_ace) {
      //The document the person is typing on.
      var sessionDoc = _ace[1].getSession().getDocument();
      //Was erroring without this if statement. Not sure why. 
      if ($scope.textInEditor !== sessionDoc.getValue() ) {
        //setting $scope.textInEditor equal to the text in the document
        $scope.textInEditor = sessionDoc.getValue();

        //send a signal with all the text from the document
        socket.emit('add-customer', {textFromDoc: $scope.textInEditor});
        
      }

      console.log("testInEditor", $scope.textInEditor);
     
      //When a signal(called notification) is sent, then run the callback function.
      socket.on('notification', function(data) {
        //data will be the information the server is sending.

        console.log("Just heard a notification from the server");
        //if the text in the document is not the same as the user's version of the text in the editor.
        if ($scope.textInEditor !== data.textFromDoc){
          //set the variable $scope.textInEditor to the text received from the server.
          $scope.textInEditor = data.textFromDoc;
          //change the user's document to reflect the other's typing. 
          sessionDoc.setValue($scope.textInEditor);
          console.log("We are listening and in the if In the if and we are console logging sessiondoc.getvalue");
          }
        });
      }
  };

  // $scope.aceModel = ';; Scheme code in here.\n' +
  //   '(define (double x)\n\t(* x x))\n\n\n' +
  //   '<!-- XML code in here. -->\n' +
  //   '<root>\n\t<foo>\n\t</foo>\n\t<bar/>\n</root>\n\n\n' +
  //   '// Javascript code in here.\n' +
  //   'function foo(msg) {\n\tvar r = Math.random();\n\treturn "" + r + " : " + msg;\n}';
 
  

  $scope.add = function(){
    $scope.id++
    var total = $scope.id + $scope.removeid;
    $scope.filesList.push({id: total, title: $scope.title, code: $scope.aceModel, mode: $scope.mode});
    console.log("This is the text in the editor",$scope.filesList[0].code);
    $scope.title = '';
    $scope.aceModel = '';

  };

  $scope.update = function(id){
    var index = selectId(id);
    $scope.filesList[index].title = $scope.title;
    $scope.filesList[index].code = $scope.aceModel;
    $scope.filesList[index].mode = $scope.mode;
    $scope.title = '';
    $scope.aceModel = '';

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
    var store = $scope.filesList[$scope.removeid];
    $scope.filesList.splice(index, 1);
    $scope.removeid++;
    $scope.id--
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

