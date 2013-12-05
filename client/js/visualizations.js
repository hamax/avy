/* ========================================================================
 * Avy Algorithm Visualization Framework
 * https://github.com/hamax/avy
 * ========================================================================
 * Copyright 2013 Ziga Ham
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */

// Visualization list page
app.controller('VisualizationsCtrl', function($scope, $location, api) {
	api.listVisualizations({}, function(result) {
		$scope.visualizations = result;
	});

	// Get a preview image url
	$scope.getPreview = function(visualization) {
		return 'http://anif.' + settings.domain + settings.port + '/visualizations/' + visualization.Key + '/preview.svg';
	};

	// Open a visualization
	$scope.click = function(key) {
		$location.path('/visualizations/' + key + '/');
	};
});

// Visualization page
app.controller('VisualizationCtrl', function($scope, $routeParams, api, fileApi) {
	$scope.key = $routeParams.key;
	$scope.selected = {preview: true, code: false};
	api.getVisualization($scope.key, function(result) {
		$scope.update(result);
	});

	// Check if we have write access
	$scope.readOnly = function() {
		return !$scope.data || $scope.data.Owner != settings.user;
	};

	// Save changed title to the database
	$scope.saveTitle = function() {
		api.setVisualizationTitle($scope.key, $scope.data.Title);
	};

	var ext2grp = {
		'js': 1,
		'avy': 2,
		'in': 2
	};

	// Update if the was a change to the file list
	$scope.update = function(data) {
		$scope.data = data;

		$scope.files = [[], [], []];
		$scope.avys = [];
		for (var i = 0; data.Files && i < data.Files.length; i++) {
			var ext = data.Files[i].Filename.split('.').pop();
			data.Files[i].ext = ext;
			data.Files[i].url = '/visualizations/' + $scope.key + '/' + data.Files[i].Filename;
			data.Files[i].delete = api.deleteVisualizationFile.bind(api, $scope.key, data.Files[i].Filename);
			$scope.files[ext2grp[ext] || 0].push(data.Files[i]);
			if (ext == 'avy') {
				data.Files[i].basename = data.Files[i].Filename.substr(0, data.Files[i].Filename.length - ext.length - 1);
				$scope.avys.push(data.Files[i]);
				if (!$scope.activeAvy) {
					$scope.activeAvy = data.Files[i].Filename;
				}
			}
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

	// Select .avy file for preview
	$scope.selectAvy = function(file) {
		$scope.activeAvy = file.Filename;
	};
});

// Content editable field (used for title)
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

// Visualization preview field
app.directive('visualizationPreview', function() {
	return {
		link: function(scope, elm, attrs, ctrl) {
			var iframe = null, current = null;

			// Load frame for current .avy file and listen for changes
			scope.$watch('activeAvy', function() {
				if (scope.activeAvy == current) {
					return;
				}
				current = scope.activeAvy;

				if (current) {
					elm.html('<iframe src="http://anif.' +
						settings.domain + settings.port +
						'/visualizations/' +
						scope.key + '/' +
						'#' + current +
						'&http://www.' + settings.domain + settings.port +
						'" frameborder="0" style="width: 100%; display: none"></iframe>');
					iframe = $(elm).find('iframe');
				} else {
					elm.html('');
					iframe = null;
				}
			});

			// Listen for messages from the visualization
			window.addEventListener('message', function(event) {
				if (event.origin == 'http://anif.' + settings.domain + settings.port && event.data.type == 'resize' && iframe) {
					// Set iframe height to the height reported by the visualization
					iframe.height(event.data.height);
					iframe.css('display', 'block');
				}
			}, false);
		}
	}
});