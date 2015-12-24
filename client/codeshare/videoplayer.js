angular.module('myApp')
  .directive('videoPlayer', function ($sce) {
    return {
<<<<<<< HEAD
      template: '<div><video ng-src="" autoplay></video></div>',
=======
      template: '<div><video ng-src="{{trustSrc()}}" autoplay></video></div>',
>>>>>>> aa1aac033867590cdc98122be95f89af9193c16f
      restrict: 'E',
      replace: true,
      scope: {
        vidSrc: '@'
      },
      link: function postLink(scope) {
        console.log('Initializing video-player');
<<<<<<< HEAD
        scope.trustSrc = function(){
          if(!scope.vidSrc){
            return undefined;
=======
        console.log(scope.vidSrc)
        scope.trustSrc = function(){
          if(!scope.vidSrc){
            console.log('hyyyyyy');
>>>>>>> aa1aac033867590cdc98122be95f89af9193c16f
          }
          return $sce.trustAsResourceUrl(scope.vidSrc);
        };
      }
    };
  });
