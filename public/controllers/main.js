angular.module('MyApp')
  .controller('MainCtrl', ['$scope', 'Show', function($scope, Show) {

    $scope.shows = Show.query();

  }]);
