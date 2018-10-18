

angular.module('AuthController', ['services'])
.controller('BioCtrl', function($scope, $state, UserService) {
  $scope.msg = "Please log in..";
  $scope.btn = "Log In";
  $scope.label = "Log In";
  $scope.dispBiometric = false;
  $scope.dispLockOut = false;
  $scope.state = 0;
  
  function setState(state) {
    //LoggedOut - without token
    $scope.state = state;
    $scope.dispBiometric = false;
    if (state == 0) {
      $scope.msg = "Please log in..";
      $scope.dispLockOut = false;
      $scope.btn = "Log In";
      $scope.label = "Log In";
      $route.reload();
      return;
    } else if (state == 1) {
      //LoggedOut - with token
      $scope.msg = "Please log in..";
      $scope.dispBiometric = true;
      $scope.dispLockOut = false;
      $scope.btn = "Log In";
      $scope.label = "Log In";
    } if (state == 2) {
      //LoggedIn - without lock
      // no stored token..      
      $scope.msg = "You are logged in!";
      $scope.btn = "Log Out";
      $scope.dispLockOut = false;      
      $scope.label = "Log In";      
    } if (state == 3) {
      //LoggedIn - with lock!      
      $scope.msg = "You are logged in!";
      $scope.btn = "Log Out";
      $scope.dispLockOut = true;
      $scope.label = "Lock Out";
    }

  }
  
  function logoutAction() {
    UserService.logout()
    .then(function(data){
      setState(0);
      console.log("User logged out", data);
    }, function(msg){
      console.log("Err logging out", msg);
    });    
  }

  $scope.login = function(user, email) {
    var token = null;
    
    //Firstly confirm if its logged-in, if so logout
    if ($scope.btn == "Log Out") {
      logoutAction();
      return;
    }
    
    
    UserService.login(user, email)
    .then(function(data) {
      token = data;
      
      alert(token);
    
      //Save this token..
      UserService.saveSession(email, token)
      .then(function() {
        setState(3);
        console.log("Session save - SUCCESS!");
      }, function(){
        setState(2);
        console.log("Session save - FAILED!");
      });
    }, function(msg){
      setState(0);
      alert(msg);
    });
  }
  
  $scope.logout = function() {
    logoutAction();
  }

  $scope.lockout = function() {
    UserService.lockOut()
    .then(function(data){
      setState(1);
      console.log("User logged out", data);
    }, function(msg){
      console.log("Err logging out", msg);
    });
    
  }
  
  $scope.bioLogin = function() {
    alert("Hi");
    setState(2);
  }
  
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
  
  
  $scope.tryAuth = function() {
    //If authenticated
    $scope.label = ($scope.label == "Log Out") ? "Log In" : "Log Out" ;
    $scope.dispBiometric = !$scope.dispBiometric;
  }
})

.controller('AddCtrl', function($scope, $state) {
  $scope.title = "New Note";

});