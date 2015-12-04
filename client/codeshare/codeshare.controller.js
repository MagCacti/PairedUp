angular.module('myApp.codeshare', [])

.controller('CodeShareController', ['$scope', function($scope){
  console.log('inside the codesharecontroller');
  $scope.filesList = [];
  $scope.id = 0;
  $scope.removeid = 0;
  $scope.modes = ['Scheme', 'XML', 'Javascript', 'HTML', 'Ruby', 'CSS', 'Curly', 'CSharp', 'Python', 'MySQL'];
  $scope.mode = $scope.modes[0];


  $scope.aceOption = {
    mode: $scope.mode.toLowerCase(),
    onLoad: function (_ace) {
      $scope.modeChanged = function () {
          _ace.getSession().setMode("ace/mode/" + $scope.mode.toLowerCase());
      };
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