//
// Define the AngularJS application main module
// along with its dependencies: the ngRoute module.
//
angular.module('TodoApp', ['ngRoute'])
//
// Define a value which can be injected when necessary
//
.value(
    'config', {
        apiBaseURL: "http://192.168.64.131:3000/api/"
    }
)
//
// When an AngularJS app is started, it has a certain “boot-order”.
// First the "config" step.
//
.config(function($routeProvider) { // providers & constants
    // do configuration

    //
    // Define the configuration for the
    // route provider.
    //
    var routeConfig = {
        // the templateUrl key specifies the template to use
        // to render a particular page.
        templateUrl: 'todo-app-index.html',
        // the controller key specifies the controller to use
        // to render a particular page.
        controller: 'todoController',
        // the resolve key can specify additional parameters to be resolved
        // before executing the controller.
        resolve: {
            // The store parameter will be resolved as a dependence
            // for the controller, so will be injected in our todoController
            store: function (todoStorage) {
                // Get the correct module (API or localStorage).
                return todoStorage.then(function (module) {
                    module.read(); // Fetch the todo records in the background.
                    return module;
                });
            }
        }
    };

    //
    // Configure the route provider:
    // really basic here, any URL will render our
    // page template with our controller, as specified
    // in routeConfig.
    //
    $routeProvider
        .when('/', routeConfig)
        .otherwise({
            redirectTo: '/'
        });

})
//
// Then the "run" step.
//
.run(function() { // services & constants
    // do initialization
});