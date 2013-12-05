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