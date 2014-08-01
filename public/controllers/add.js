angular.module('MyApp')
  .controller('AddCtrl', ['$scope', '$alert', '$http', 'Show', function($scope, $alert, $http, Show) {
    //$scope.returned_msg = global_return_msg;
    //$scope.returned_message = "_";
/*
    function($http){
        //make api call, filter for last item
	var all_msgs = $http.get('/api/v1/history');
	console.log("all_msgs: " + all_msgs);
    };
*/
    $scope.addShow = function() {
      Show.save({ msg_sent: $scope.msg_sent },
        function() {
          $scope.showName = '';
          $scope.addForm.$setPristine();
          $alert({
            content: 'Success!! Translation Completed!',
            placement: 'top-right',
            type: 'success',
            duration: 5
          });
        },
        function(response) {
          $scope.showName = '';
          $scope.addForm.$setPristine();
	  console.log(response.data.body);
	  $scope.returned_message = response;
          $alert({
            content: response.data.body,
            placement: 'top-right',
            type: 'danger',
            duration: 3
          });
        });
    };
  }]);
