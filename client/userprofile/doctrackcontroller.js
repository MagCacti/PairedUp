angular.module('myApp')
  .controller('DocTrackController', ['$scope', 'Account', 'documentData', 'profileData', function($scope, Account, documentData, profileData) {

    //$scope.documents = [];
    
    // documentData.countAllUserDocs().success(function(data){
    //     for (var i=0; i<data.length; i++){
    //       $scope.allDocs.push(data[i])
    //     }
    //   })

    $scope.allDocs= []; 
    documentData.getAllDocs().success(function(data){
        for (var i = 0; i < data.length; i++){
          $scope.allDocs.push(data[i])

      }
    })
            
      

    console.log("this is all docs", $scope.allDocs)

  }])