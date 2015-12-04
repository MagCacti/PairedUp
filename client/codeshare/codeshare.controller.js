angular.module('myApp.codeshare', [ ])

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
    // broadcast: function(eventName, data){
    //   socket.broadcast.emit(eventName,data);
    // }
  };
}])

.controller('CodeShareController', ['$scope','socket', function($scope, socket){
  console.log('inside the codesharecontroller');
  console.log("Socket", socket);
  $scope.filesList = [];
  $scope.id = 0;
  $scope.removeid = 0;
  $scope.modes = ['Scheme', 'XML', 'Javascript', 'HTML', 'Ruby', 'CSS', 'Curly', 'CSharp', 'Python', 'MySQL'];
  $scope.mode = $scope.modes[0];
  $scope.textInEditor;

  $scope.aceOption = {
    mode: $scope.mode.toLowerCase(),
    onLoad: function (_ace) {
      $scope.modeChanged = function () {
          _ace.getSession().setMode("ace/mode/" + $scope.mode.toLowerCase());
      };
    },
    onChange: function(_ace) {
      console.log('arguments',arguments);
      console.log("_ace", _ace)
      console.log("_ace get session", _ace[1].getSession().getDocument().getValue())
      // _ace[1].getSession().getDocument().setValue("Setting the value");
      $scope.textInEditor;
      socket.emit('add-customer')
      socket.on('notification', function(data) {
        console.log("Just hear a notification from the server")
        //I believe apply is important for this controller regardless of what we end up doing. I will research it more and update this comment about its ability.
        });
    }
  };

  $scope.aceModel = ';; Scheme code in here.\n' +
    '(define (double x)\n\t(* x x))\n\n\n' +
    '<!-- XML code in here. -->\n' +
    '<root>\n\t<foo>\n\t</foo>\n\t<bar/>\n</root>\n\n\n' +
    '// Javascript code in here.\n' +
    'function foo(msg) {\n\tvar r = Math.random();\n\treturn "" + r + " : " + msg;\n}';
 
  

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

