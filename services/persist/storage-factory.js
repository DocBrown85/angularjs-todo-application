angular.module('TodoApp')
//
// Declare the todoStorage factory: this will serve as a high-level
// factory method to get the proper storage API according to the
// availability of a remote API or to fallback to browser's local
// storage.
//
.factory('todoStorage', function ($http, $injector, config) {

    console.log(config);
  
    // If a remote API exists
    return $http.get(config.apiBaseURL)
        .then(function () {
            // Return the interface to the remote API.
            console.log("remote");
            return $injector.get('remoteAPI');
        }, function () {
            // Otherwise return the interface to the local storage.
            console.log("local");
            return $injector.get('localStorage');
        }
    );

});