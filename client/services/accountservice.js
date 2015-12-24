angular.module('myApp')
.factory('Account', function($http, $window) {

    return {
      getProfile: function() {
        console.log('inside the factory-------------');
          return $http.get('/account')
        .success(function(req, res){
          console.log('this is a successful callback of /account', res);
          console.log('this is a successful callback of /account for req', req);
         
          // console.log(test);
          var username = req.profile.displayName;
          console.log('this is req.data.whatever', username)
          return username;
        })
      
      },

      isAuthenticated: function() {
          return $http.get('/checkIfLoggedIn').then(function(response){
            console.log('this is isAuthenticated', response, 'response.data', response.data.loggedIn)
            return response.data.loggedIn;
        });
        },

      setData: function(val) {
            $window.localStorage && $window.localStorage.setItem('notLoggedIn', val);
            return this;
          },
          //sets the value, of whether the user is logged our, into the localStorage. 
          setLoggedOutData: function(val) {
            $window.localStorage && $window.localStorage.setItem('Loggedout', val);
            return this;
          },
          //sets the value, of the display name, into the localStorage. 

      setLogInData: function(val) {
            $window.localStorage && $window.localStorage.setItem('UserDisplayName', val);
            return this;
          },
          getLogInData: function() {
            return $window.localStorage && $window.localStorage.getItem('UserDisplayName');
          },
          //another check to login, used to make separate decisions on whether the user is already logged in or logged out.
          setCheckingIfLogInData: function(val) {
            $window.localStorage && $window.localStorage.setItem('loggedIn', val || 1);
            return this;
          },
          getCheckingIfLogInData: function() {
            return $window.localStorage && $window.localStorage.getItem('loggedIn');
          },
          getLoggedOutData: function() {
            return $window.localStorage && $window.localStorage.getItem('Loggedout');
          },
          getData: function() {
            return $window.localStorage && $window.localStorage.getItem('notLoggedIn');
          },
      updateProfile: function(profileData) {
        return $http.put('/api/me', profileData);
      }
    };
})