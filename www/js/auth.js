

angular.module('AuthController', ['services'])
.controller('LoginCtrl', function($scope, UserService) {
  $scope.login = function(user, email) {
    var token = null;
    UserService.login(user, email)
    .then(function(data) {
      token = data;
      
      alert(token);
    
      //Save this token..
      UserService.saveSession(email, token)
      .then(function() {
        console.log("Session save - SUCCESS!");
      }, function(){
        console.log("Session save - FAILED!");
      });
    }, function(msg){
      alert(msg);
    });
  }
})

.controller('BioCtrl', function($scope, $state, UserService) {
  $scope.title = "Edit";
  $scope.check = function() {
    //alert('Login clicked!');
    console.log("Checking things..");

    var hasToken = false;
    
    UserService.hasStoredToken()
    .then(function(data){
      hasToken = data;
      if (hasToken) {
        var token = null;
        UserService.getStoredToken()
        .then(function(data){
          token = UserService.deserializeMultiToken(data);
          console.log("Logging in..: ", token);
        }, function(msg){
          console.log("Error in finding token!");
        });
      } else {
        console.log("Token not found");
      }      
    });

  }
})

.controller('AddCtrl', function($scope, $state) {
  $scope.title = "New Note";

});