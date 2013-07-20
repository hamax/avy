app.controller('ModulesCtrl', function($scope, $location, api) {
	api.listModules({}, function(result) {
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

	$scope.readOnly = function() {
		return !$scope.data || $scope.data.Owner != settings.user;
	};

	/*
	 * Code tab
	 */

	$scope.update = function(data) {
		$scope.data = data;

		$scope.files = [data.Files || []];
		for (var i = 0; i < $scope.files.length; i++) {
			for (var j = 0; j < $scope.files[i].length; j++) {
				var ext = $scope.files[i][j].Filename.split('.').pop();
				$scope.files[i][j].ext = ext;
				$scope.files[i][j].url = '/modules/' + $scope.devname + '/' + $scope.name + '/' + $scope.files[i][j].Filename;
			}
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