angular.module('MyApp')
  .factory('Show', ['$resource', function($resource) {
    //return $resource('/api/shows/:_id');
    return $resource('/api/v1/history');
  }]);
