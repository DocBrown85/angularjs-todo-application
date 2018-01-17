angular.module('TodoApp')

.factory('remoteAPI', function($http, config) {

    var store = {

        todos: [],

        create: function (todo) {

            var originalTodos = store.todos.slice(0);

            return $http.post(
                config.apiBaseURL + "/todos",
                todo
            ).then(function(resp) {

                todo.id = resp.data._id;
                store.todos.push(todo);
                return store.todos;

            }, function error() {

                angular.copy(originalTodos, store.todos);
                return store.todos;

            });
        },
    
        read: function () {

            return $http.get(
                config.apiBaseURL + "/todos"
            )
            .then(function(resp) {
                angular.copy(resp.data, store.todos);
                return store.todos;
            })

        },
    
        update: function (todo) {
            
            var originalTodos = store.todos.slice(0);
            
            return $http.put(
                config.apiBaseURL + "/todos/" + todo._id,
                todo
            )
            .then(function() {
                return store.todos;
            },
            function() {
                angular.copy(originalTodos, store.todos);
                return originalTodos;
            });

        },
    
        delete: function (todo) {
            
            var originalTodos = store.todos.slice(0);
            
            store.todos.splice(store.todos.indexOf(todo), 1);

            return $http.delete(
                config.apiBaseURL + "/todos/" + todo._id
            )
            .then(function() {

                return store.todos;

            },
            function() {

                angular.copy(originalTodos, store.todos);
                return originalTodos;

            });

        },

        deleteCompleted: function () {

            var originalTodos = store.todos.slice(0);

            var completeTodos = [];
            var incompleteTodos = [];
            store.todos.forEach(function (todo) {
                if (todo.done) {
                    completeTodos.push(todo);
                } else {
                    incompleteTodos.push(todo);
                }
            });

            angular.copy(incompleteTodos, store.todos);

            return $http.delete(
                config.apiBaseURL + "/todos"
            )
            .then(function success() {
                return store.todos;
            }, function error() {
                angular.copy(originalTodos, store.todos);
                return originalTodos;
            });
            
        }

    };

    return store;

});
