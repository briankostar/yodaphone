angular.module('MyApp')
  .factory('Show', ['$resource', function($resource) {
    return $resource('/api/v1/history');
  }]);
