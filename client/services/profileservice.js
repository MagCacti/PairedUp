angular.module('myApp')
	.factory('profileData', ['$http', function($http){
	  	var obj = {
	    	skills: ['hello'],
	    	allUsers: []
	  	}

	  	obj.getAllUsers = function () {
	  		return $http.get('/oneuserskill').success(function(data){
	  			console.log('data from getOneUser', data)
	  			for (var i=0; i<data.length; i++){
	  				obj.allUsers.push(data[i])	
	  			}
	  		})
	  	}

	  	obj.addSkills = function (skill) {
	  		return $http.post('/skills', skill);
	  	}

	  	obj.futureSkills = function (skill) {
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
}])


// Note: This results in an exportable factory object that looks like this:

// var obj = {
// 	skills : ['hello'], 
// 	allUsers : [ ],
// 	getAll : function, NOT USED
// 	getAllUsers : function, USED BUT NOT CLEAR HOW
// 	addSkills : function,
// 	futureSkills : function,
// }