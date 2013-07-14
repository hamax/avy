app.controller('DashboardCtrl', function($scope, $location, api) {
	api.listVisualizations({'user': 'me'}, function(result) {
		$scope.visualizations = result;
	});

	$scope.clickVisualization = function(key) {
		$location.path('/visualizations/' + key + '/');
	};

	$scope.newVisualization = function() {
		api.newVisualization(function(key) {
			$location.path('/visualizations/' + key + '/');
		});
	};

	api.listModules({'user': 'me'}, function(result) {
		$scope.modules = result;
	});

	$scope.clickModule = function(module) {
		$location.path('/modules/' + module.Devname + '/' + module.Name + '/');
	};

	$scope.newModule = function() {
		$location.path('/modules/new');
	};
});