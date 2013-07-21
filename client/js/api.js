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