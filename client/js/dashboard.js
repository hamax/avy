app.controller('DashboardCtrl', function($scope, $location, api) {
	// Load list of my visualization
	api.listVisualizations({'user': 'me'}, function(result) {
		$scope.visualizations = result;
	});

	// Get preview image
	$scope.getPreview = function(visualization) {
		return 'http://anif.' + settings.domain + settings.port + '/visualizations/' + visualization.Key + '/preview.svg';
	};

	// Open a visualization
	$scope.clickVisualization = function(key) {
		$location.path('/visualizations/' + key + '/');
	};

	// Create a new visualization
	$scope.newVisualization = function() {
		api.newVisualization(function(key) {
			$location.path('/visualizations/' + key + '/');
		});
	};

	// Load list of my modules
	api.listModules({'user': 'me'}, function(result) {
		$scope.modules = result;
	});

	// Open a module
	$scope.clickModule = function(module) {
		$location.path('/modules/' + module.Devname + '/' + module.Name + '/');
	};

	// Open new module creation page
	$scope.newModule = function() {
		$location.path('/modules/new');
	};
});