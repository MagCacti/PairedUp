angular.module('myApp')
	.factory('profiledata', ['$http', function($http){
	  	var obj = {
	    	skills: ['hello'],
	    	allUsers: []
	  	}

	  	obj.findUser = function(user){
	  		return $http.post('/founduser', user).success(function(data){
	  			return data;
	  		})
	  	}


	  	obj.getAll = function() {
	  	  return $http.get('/profile').success(function(data){
	  	    angular.copy(data, obj.skills);
	  	  });
	  	};

	  	obj.getAllUsers = function (){
	  		return $http.get('/oneuserskill').success(function(data){
	  			console.log('data from getOneUser', data)
	  			for (var i=0; i<data.length; i++){
	  				obj.allUsers.push(data[i])	
	  			}
	  		})
	  	}

	  	obj.addSkills = function(skill){
	  		return $http.post('/skills', skill);
	  	}

	  	obj.futureSkills = function (skill){
	  		return $http.post('/futureskills', skill)
	  	}
	  	// obj.create = function(skills) {
	  	//     console.log('this these are the skills', skills)
	  	//   return $http.post('/skills', skills).success(function(data){
	  	//   	console.log('this is create data', data)
	  	//   	obj.skills.push(data)
	  	//   });
	  	// };
	  	return obj;
}]);