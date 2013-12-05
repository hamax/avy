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

/*
 * Simple wrapper for the API.
 */
app.service('api', function($http) {
	$http.defaults.headers.post["Content-Type"] = 'application/x-www-form-urlencoded';

	/*
	 * Visualizations
	 */

	this.listVisualizations = function(filters, callback) {
		$http.get('/api/visualizations/?' + $.param(filters)).success(function(result) {
			for (var i = 0; i < result.length; i++) {
				result[i].Date = Date.parse(result[i].Date);
			}
			callback(result);
		});
	};

	this.newVisualization = function(callback) {
		$http.post('/api/visualizations/').success(function(result) {
			callback(result['key']);
		});
	};

	this.getVisualization = function(key, callback) {
		$http.get('/api/visualizations/' + key + '/').success(function(result) {
			callback(result);
		});
	};

	this.setVisualizationTitle = function(key, title) {
		$http.post('/api/visualizations/' + key + '/title', $.param({'title': title}));
	};

	this.deleteVisualizationFile = function(key, filename, callback) {
		$http.post('/api/visualizations/' + key + '/files/delete', $.param({action: 'delete', filename: filename})).success(function(result) {
			callback(result);
		});
	};

	/*
	 * Modules
	 */

	this.listModules = function(filters, callback) {
		$http.get('/api/modules/?' + $.param(filters)).success(function(result) {
			for (var i = 0; i < result.length; i++) {
				result[i].Date = Date.parse(result[i].Date);
			}
			callback(result);
		});
	};

	this.newModule = function(module, callback) {
		$http.post('/api/modules/', $.param(module)).success(function(result) {
			callback(result);
		});
	};

	this.getModule = function(devname, name, callback) {
		$http.get('/api/modules/' + devname + '/' + name + '/').success(function(result) {
			callback(result);
		});
	};

	this.deleteModuleFile = function(devname, name, filename, callback) {
		$http.post('/api/modules/' + devname + '/' + name + '/files/delete', $.param({action: 'delete', filename: filename})).success(function(result) {
			callback(result);
		});
	};
});