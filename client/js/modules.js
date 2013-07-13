app.controller('ModulesCtrl', function($scope, $location, api) {
	api.listModules(function(result) {
		$scope.modules = result;
	});

	$scope.click = function(module) {
		$location.path('/modules/' + module.Devname + '/' + module.Name + '/');
	};
});

app.controller('NewModuleCtrl', function($scope, $location, api) {
	$scope.create = function() {
		api.newModule($scope.module, function(response) {
			$location.path('/modules/' + response.Devname + '/' + response.Name + '/');
		});
	};
});


app.controller('ModuleCtrl', function($scope, $routeParams, api, fileApi) {
	$scope.devname = $routeParams.devname;
	$scope.name = $routeParams.name
	api.getModule($scope.devname, $scope.name, function(result) {
		$scope.update(result);
	});

	/*
	 * Code tab
	 */

	$scope.update = function(data) {
		$scope.data = data;

		$scope.files = [data.Files || []];
		for (var i = 0; i < $scope.files.length; i++) {
			$scope.files[i].sort(function(a, b) {
				if (a.Filename > b.Filename) {
					return 1;
				}
				if (a.Filename < b.Filename) {
					return -1;
				}
				return 0;
			});
		}
	};
});