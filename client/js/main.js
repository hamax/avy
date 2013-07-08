var app = angular.module('avy', ['ui.bootstrap']);

app.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {templateUrl: '/partials/homepage.html', controller: 'HomepageCtrl'})
		.when('/dashboard', {templateUrl: '/partials/dashboard.html', controller: 'DashboardCtrl'})
		.when('/visualizations', {templateUrl: '/partials/visualizations.html', controller: 'VisualizationsCtrl'})
		.when('/visualizations/:key', {templateUrl: '/partials/visualization.html', controller: 'VisualizationCtrl'})
		.when('/modules', {templateUrl: '/partials/modules.html', controller: 'ModulesCtrl'})
		.when('/about', {templateUrl: '/partials/about.html', controller: 'AboutCtrl'})
		.when('/login', {redirectTo: function() { window.location = '/login'; }})
		.when('/logout', {redirectTo: function() { window.location = '/logout'; }})
		.otherwise({redirectTo: '/'});

	$locationProvider
		.html5Mode(true)
		.hashPrefix('!');
});

app.service('api', function($http) {
	this.listVisualizations = function(callback) {
		$http.get('/api/visualizations/').success(function(result) {
			for (var i = 0; i < result.length; i++) {
				result[i].Date = Date.parse(result[i].Date);
			}
			callback(result);
		});
	}

	this.newVisualization = function(callback) {
		$http.post('/api/visualizations/').success(function(result) {
			callback(result['key']);
		});
	}

	this.getVisualization = function(key, callback) {
		$http.get('/api/visualizations/' + key).success(function(result) {
			callback(result);
		});
	}
});

app.service('fileApi', function() {
	var iframe = $('<iframe src="http://anif.' + settings.domain + settings.port + '/framework/api.html" style="display: none"></iframe>'),
		ready = false, messages = {}, nextId = 0;
	iframe.load(function() {
		ready = true;
		for (var id in messages) {
			send(messages[id]);
		}
	});
	$('body').append(iframe);

	function send(msg) {
		iframe[0].contentWindow.postMessage(msg.content, 'http://anif.' + settings.domain + settings.port);
	}

	window.addEventListener('message', function(event) {
		if (event.origin == 'http://anif.' + settings.domain + settings.port) {
			messages[event.data.id].callback(event.data.content);
		}
	}, false);

	this.getVisualizationFile = function(key, filename, callback) {
		var msg = {
			'callback': callback,
			'content': {
				'id': nextId++,
				'visualization': key,
				'filename': filename
			}
		};
		messages[msg.content.id] = msg;
		if (ready) {
			send(msg);
		}
	};
});

app.controller('RootCtrl', function($scope, $location) {
	$scope.isActive = function(route) {
		return $location.path().indexOf(route) == 0;
	};
});

app.controller('HomepageCtrl', function($scope) {

});

app.controller('DashboardCtrl', function($scope) {

});

app.controller('VisualizationsCtrl', function($scope, $location, api) {
	api.listVisualizations(function(result) {
		$scope.visualizations = result;
	});

	$scope.click = function(key) {
		$location.path('/visualizations/' + key);
	};

	$scope.createNew = function() {
		api.newVisualization(function(key) {
			$location.path('/visualizations/' + key);
		});
	};
});

app.controller('VisualizationCtrl', function($scope, $routeParams, api, fileApi) {
	$scope.key = $routeParams.key;
	$scope.files = {};
	api.getVisualization($scope.key, function(result) {
		$scope.update(result);
	});

	$scope.update = function(data) {
		$scope.data = data;
		for (var i = 0; i < data.Files.length; i++) {
			fileApi.getVisualizationFile($scope.key, data.Files[i].Filename, function(i, content) {
				$scope.$apply(function() {
					$scope.files[data.Files[i].Filename] = content;
				});
			}.bind(this, i));
		}
	};

	$scope.uploadComplete = function(a) {

	};

	$scope.uploadError = function() {

	};
});

app.controller('ModulesCtrl', function($scope) {

});

app.controller('AboutCtrl', function($scope) {

});