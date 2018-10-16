
  
angular.module('services', [])
.service('UserService', function() {
  var authVault = null;
  var authPlugin = null;

  var token = null;
  var userInfo = null;
  
  function init() {
    authPlugin = window.IonicNativeAuth;
    authVault = authPlugin.createVault({
        // Whether to enable biometrics automatically when the user logs in
        enableBiometrics: false,
        // Lock the app if it is terminated and re-opened
        lockOnClose: false,
        // Lock the app after N milliseconds of inactivity
        lockAfter: 1000 * 60 * 30, // 30 minutes
        // Obscure the app when the app is backgrounded (most apps will want
        // to set this to false unless sensitive financial data is being displayed)
        secureOnBackground: true, 
        onLock: onVaultLocked
    });

    console.log("Got vault :", authVault);
    return authVault;
  }

  function onVaultLocked() {
    console.log('Vault locked');
    // Clear our in-memory token
    token = null;

    // Vault locked due to inactivity
    //this.clearSession();
    //const nav = this.app.getRootNavs()[0];

    alert('You are being securely logged off.');

    //if (nav) {
    //  nav.setRoot(LoginPage);
    //}
  }


  function onSessionRestored(t) {
    token = t;
  }

  function isLoggedIn() {
    return !!token
  }
  
  /*
   * Perform a login request
   * @param email
   * @param password
   */
  function login(email, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        //This is what the API returns
        setInfo({
          name: 'Mano'
        })
        const fakeToken = 'deadabcd=12345';
        saveSession(email, fakeToken);
        resolve(fakeToken);
      }, 1000);
    })
  }

  /*
   * Log the user out entirely, and forget any stored
   * authentication tokens
   */
  function logout() {
    //const vault = await this.getVault();
    return authVault.clear();
  }

  /*
   * Lock the user out without clearing their secure session
   * information from the vault
   */
  function lockOut() {
    //const vault = await this.getVault();
    return authVault.lock();
  }

  /**
   * Save a user session in the vault
   * @param email
   * @param token
   */
  function saveSession(email, t) {
    // Store the token for HTTP requests later
    token = t;

    // Store the credentials to the secure vault
    //const vault = await this.getVault();
    return authVault.storeToken(email, serializeMultiToken(token));
  }
  
  /**
   * Return the saved token in the vault. This will trigger
   * biometric authentication if the vault is locked
   */
  function getStoredToken() {
    //const vault = await this.getVault();
    //let _token = await vault.getToken();
    
    return authVault.getToken();
    //_token = deserializeMultiToken(_token);
    //token = _token;
    //return token;
  }  
  
  // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
  var setUser = function(user_data) {
    window.localStorage.starter_facebook_user = JSON.stringify(user_data);
  };

  var getUser = function(){
    return JSON.parse(window.localStorage.starter_facebook_user || '{}');
  };

  /**
   * Check if there is a stored token in the vault.
   */
  function hasStoredToken() {
    //const vault = await this.getVault();
    return authVault.hasStoredToken();
  }
  
  /**
   * User info contains metadata about the user from the server,
   * such as their name, email, or any other important info.
   */
  function getInfo() {
    return userInfo;
  }

  /**
   * Set metadata for this user
   * @param info
   */
  function setInfo(info) {
    userInfo = info;
  }
  

  function serializeMultiToken(_token) {
    if (_token !== null && typeof _token === 'object') {
      return JSON.stringify(_token);
    }
    return _token;
  }

  function deserializeMultiToken (_token) {
    try {
      return JSON.parse(_token);
    } catch (err) {
      return _token;
    }
  }

  
  return {
    init: init,
    login: login,
    hasStoredToken: hasStoredToken,
    deserializeMultiToken: deserializeMultiToken,
    saveSession: saveSession,
    getStoredToken: getStoredToken,
    getUser: getUser,
    setUser: setUser 
  };
});