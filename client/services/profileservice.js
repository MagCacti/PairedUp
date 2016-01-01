angular.module('myApp')
	.factory('profiledata', ['$http', function($http){
	  	var obj = {
	    	skills: ['hello']
	  	};

	  	obj.getAll = function() {
	  	  return $http.get('/profile').success(function(data){
	  	    angular.copy(data, obj.skills);
	  	  });
	  	};

	  	obj.addSkills = function(id, skill){
	  		return $http.post('/skills/'+id, skill);
	  	};

	  	// obj.create = function(skills) {
	  	//     console.log('this these are the skills', skills)
	  	//   return $http.post('/skills', skills).success(function(data){
	  	//   	console.log('this is create data', data)
	  	//   	obj.skills.push(data)
	  	//   });
	  	// };
	  	return obj;
}]);