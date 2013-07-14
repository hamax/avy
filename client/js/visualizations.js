app.controller('VisualizationsCtrl', function($scope, $location, api) {
	api.listVisualizations(function(result) {
		$scope.visualizations = result;
	});

	$scope.click = function(key) {
		$location.path('/visualizations/' + key + '/');
	};
});

app.controller('VisualizationCtrl', function($scope, $routeParams, api, fileApi) {
	$scope.key = $routeParams.key;
	api.getVisualization($scope.key, function(result) {
		$scope.update(result);
	});

	$scope.saveTitle = function() {
		api.setVisualizationTitle($scope.key, $scope.data.Title);
	};

	/*
	 * Code tab
	 */

	var ext2grp = {
		'js': 1,
		'avy': 2
	};

	$scope.update = function(data) {
		$scope.data = data;

		$scope.files = [[], [], []];
		for (var i = 0; data.Files && i < data.Files.length; i++) {
			var ext = data.Files[i].Filename.split('.').pop();
			data.Files[i].ext = ext;
			data.Files[i].url = '/visualizations/' + $scope.key + '/' + data.Files[i].Filename;
			$scope.files[ext2grp[ext] || 0].push(data.Files[i]);
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

app.directive('contenteditable', function() {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
			elm.bind('keydown', function(e) {
				if (e.keyCode == 13) {
					elm.blur();
				}
			});

			// view -> model
			elm.bind('blur', function(e) {
				scope.$apply(function(s) {
					if (elm.html() !== ctrl.$viewValue) {
						ctrl.$setViewValue(elm.html());
						s.$eval(attrs.change);
					}
				});
			});

			// model -> view
			ctrl.$render = function() {
				elm.html(ctrl.$viewValue);
			};
		}
	};
});