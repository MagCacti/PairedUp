angular.module('myApp')
  .directive('videoPlayer', function ($sce) {
    return {
      template: '<div><video ng-src="{{trustSrc()}}" autoplay></video></div>',
      restrict: 'E',
      replace: true,
      scope: {
        vidSrc: '@'
      },
      link: function postLink(scope) {
        console.log('Initializing video-player');
        console.log(scope.vidSrc)
        scope.trustSrc = function(){
          if(!scope.vidSrc){
            console.log('hyyyyyy');
          }
          return $sce.trustAsResourceUrl(scope.vidSrc);
        };
      }
    };
  });
