// Module list page
app.controller('ModulesCtrl', function($scope, $location, api) {
	api.listModules({}, function(result) {
		$scope.modules = result;
	});

	// Open a module
	$scope.click = function(module) {
		$location.path('/modules/' + module.Devname + '/' + module.Name + '/');
	};
});

// New module page
app.controller('NewModuleCtrl', function($scope, $location, api) {
	// Create a new module
	$scope.create = function() {
		api.newModule($scope.module, function(response) {
			$location.path('/modules/' + response.Devname + '/' + response.Name + '/');
		});
	};
});

// Module page
app.controller('ModuleCtrl', function($scope, $routeParams, api, fileApi) {
	$scope.devname = $routeParams.devname;
	$scope.name = $routeParams.name;
	$scope.selected = {docs: true, code: false};
	api.getModule($scope.devname, $scope.name, function(result) {
		$scope.update(result);
	});

	// Check if we have write access for this module
	$scope.readOnly = function() {
		return !$scope.data || $scope.data.Owner != settings.user;
	};

	/*
	 * Code tab
	 */

	var ext2grp = {
		'js': 0
	};

	// Update if there was a change to the file list
	$scope.update = function(data) {
		$scope.data = data;

		$scope.files = [[], []];
		for (var i = 0; data.Files && i < data.Files.length; i++) {
			var ext = data.Files[i].Filename.split('.').pop();
			data.Files[i].ext = ext;
			data.Files[i].url = '/modules/' + $scope.devname + '/' + $scope.name + '/' + data.Files[i].Filename;
			data.Files[i].delete = api.deleteModuleFile.bind(api, $scope.devname, $scope.name, data.Files[i].Filename);
			$scope.files[((ext2grp[ext] + 1) || 2) - 1].push(data.Files[i]);
		}
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