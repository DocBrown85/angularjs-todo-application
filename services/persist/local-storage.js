angular.module('TodoApp')
//
// Create a factory to hold the local storage persistance API.
// This API will store/retrieve todo list in/from browser local
// storage.
//
// The API is promise-based to be fully compatible with a real world
// backended API, so we need the $q module, which is a promise library
// packed into angularjs.
//
.factory('localStorage', function($q, $filter) {

    // The Id used to store whithin the local storage our
    // todo list.
    var STORAGE_ID = 'todos-angularjs-storage';
    
    //
    // The object cointaining the exposed API for the local storage
    // persistance engine.
    //
    var store = {

        todos: [],

        create: function (todo) {
        
            var deferred = $q.defer();

            todo = angular.extend(todo, {
                id: Date.now()
            });
        
            store.todos.push(todo);
        
            store._saveToLocalStorage(store.todos);
            deferred.resolve(store.todos);
            
            return deferred.promise;

        },

        read: function () {
        
            var deferred = $q.defer();
            
            angular.copy(store._getFromLocalStorage(), store.todos);
            deferred.resolve(store.todos);
            
            return deferred.promise;

        },

        update: function (todo) {

            var deferred = $q.defer();
            
            var todoToUpdate = $filter('filter')(store.todos, {id: todo.id});
            angular.copy(todo, todoToUpdate);
            
            store._saveToLocalStorage(store.todos);
            deferred.resolve(store.todos);

            return deferred.promise;
        
        },

        delete: function (todo) {

            var deferred = $q.defer();
            
            store.todos.splice(store.todos.indexOf(todo), 1);
            
            store._saveToLocalStorage(store.todos);
            deferred.resolve(store.todos);
            
            return deferred.promise;
        
        },

        deleteCompleted: function () {
            var deferred = $q.defer();

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

            store._saveToLocalStorage(store.todos);
            deferred.resolve(store.todos);

            return deferred.promise;
        },

        //
        // Low Level functions to get/store the todo list from the
        // local storage.
        //
        // They shouldn't be used outside the module, hence the trailing '_' to
        // mark them as 'private'.
        //
        _getFromLocalStorage: function() {
            return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
        },

        _saveToLocalStorage: function (todos) {
            localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
        }

    };

    return store;

});