angular.module('myApp.codeshare', [])

.controller('CodeShareController', ['$scope', function($scope){
  console.log('inside the codesharecontroller');
  $scope.filesList = [{title: 'twerk sumn'}];
  $scope.code = 'Make sumn shake!!!!';
  $scope.id = 0;
  $scope.removeid = 0;

  $scope.add = function(){
    $scope.id++
    var total = $scope.id + $scope.removeid;
    $scope.filesList.push({id: total, title: $scope.title, code: $scope.code});
    $scope.title = '';
    $scope.code = '';

  };

  $scope.update = function(){
    var index = selectId($scope.id);
    $scope.filesList[index].title = $scope.title;
    $scope.filesList[index].code = $scope.code;
    // $scope.title = '';
    // $scope.code = '';

  };

  $scope.edit = function(id){
    var index = selectId(id);
    var item = $scope.filesList[index];
    $scope.title = item.title;
    $scope.code = item.code;

  };

  $scope.delete = function(id){
    var index = selectId(id);
    var store = $scope.filesList[$scope.removeid];
    $scope.filesList.splice(index, 1);
    $scope.removeid++;
    $scope.id--

  };

  function selectId (id){
    for(var i = 0; i < $scope.filesList.length; i++){
      if($scope.filesList[i].id === id){
        return i;
      }
    }
  };

}])