//this is all now irrevelant but the structure is useful for future reference

// angular.module('myApp')
// 	.factory('Chat', ['$http', function($http){

// 			var obj = {
// 		  	messages: ['hello']
// 			}

// 			obj.getChat = function() {
// 			  return $http.get('/chat').success(function(data){
// 			  	console.log('this is from the get request', data);
// 			    angular.copy(data, obj.messages);
// 			    return data;
// 			  });
// 			};


// 			obj.addMessage = function(msg){
// 				console.log('this is the messages', msg)
// 				return $http.post('/chat', msg).success(function(data){
//         		obj.messages.push(data)
//       			console.log('this is msg', obj.messages)
        
//         		})
// 			}

// 			// obj.create = function(skills) {
// 			//     console.log('this these are the skills', skills)
// 			//   return $http.post('/skills', skills).success(function(data){
// 			//   	console.log('this is create data', data)
// 			//   	obj.skills.push(data)
// 			//   });
// 			// };
// 			return obj;
// 	}])