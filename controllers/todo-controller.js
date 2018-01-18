angular.module('TodoApp')
//
// Adds a new controller named 'todoController' to the 'TodoApp' AngularJS
// application.
//
// The controller receives following injected args:
//
// - $scope is the application object (the owner of application variables and functions).
//
// - $routeParams holds the params we previously configured for this route.
//
// - $filter is an utility object, can only be used on arrays, and it returns an array
//   containing only the matching items.
//
// - store is the API to the storing engine we are using to persist todos.
//
.controller('todoController', function($scope, $routeParams, $filter, store) {

    // Declare scope variables
    var todos = $scope.todos = store.todos;

    $scope.newTodoDescription = "";
    
    $scope.editedTodo = null;
    
    $scope.filteringBy = 'all';
    $scope.statusFilter = {};
    
    //
    // Registers a listener callback to be executed whenever the watchExpression changes.
    //
    $scope.$watch('todos', function (newVaue, oldValue) {

        // Update todo list related variables
        $scope.remainingCount = $filter('filter')(todos, { done: false }).length;
        $scope.completedCount = todos.length - $scope.remainingCount;
        $scope.allChecked = (!$scope.remainingCount) && (todos.length != 0);
    }, true);

    //
    // Declare CRUD functions and some utilities to handle todos
    //

    $scope.createTodo = function() {

        var newTodo = {
            text: $scope.newTodoDescription,
            done: false
        };

        store
        .create(newTodo)
        .then(function() {
            $scope.newTodoDescription = "";
        });

    };

    $scope.editTodo = function (todo) {
        $scope.editedTodo = todo;
    };

    $scope.saveTodo = function(todo, event) {

        // Blur events are automatically triggered after the form submit event.
		// This does some unfortunate logic handling to prevent saving twice.
		if (event === 'blur' && $scope.saveEvent === 'submit') {
			$scope.saveEvent = null;
			return;
		}

        $scope.saveEvent = event;
        
        if (todo.text == null) {
            return;
        }
        
        todo.text = todo.text.trim();

        //
        // if the edited todo's text is a non-empty string,
        // update todo, otherwise delete it from the storage
        //
        store[todo.text ? 'update' : 'delete'](todo)
			.then(function success() {

            },
            function error() {
				todo.text = $scope.originalTodo.text;
			})
			.finally(function () {
				$scope.editedTodo = null;
			});
	};

    $scope.deleteTodo = function(todo) {

        store.delete(todo);

    };

    $scope.filterBy = function(criteria) {

        $scope.filteringBy = criteria;

        if (criteria == 'completed') {
            $scope.statusFilter = {done: true};
        }
        else if (criteria == 'notCompleted') {
            $scope.statusFilter = {done: false};
        }
        else {
            $scope.statusFilter = {};
        }

    };

    $scope.toggleDone = function(todo, done) {

        if (angular.isDefined(done)) {
            todo.done = done;
        }

        store.update(todo)
            .then(function success() {

            }, function error() {
                todo.done = !todo.done;
            });

    }

    $scope.deleteCompleted = function() {
        
        store.deleteCompleted();
                
    };

    $scope.markAll = function(done) {

        angular.forEach(todos, function(todo) {
            $scope.toggleDone(todo, done);
        }, this);

    }

});