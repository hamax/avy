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

app.controller('VisualizationCtrl', function($scope, $routeParams, api) {
	$scope.key = $routeParams.key;
	api.getVisualization($routeParams.key, function(result) {
		$scope.data = result;
	});

	$scope.uploadComplete = function(a) {

	};

	$scope.uploadError = function() {

	};
});

app.controller('ModulesCtrl', function($scope) {

});

app.controller('AboutCtrl', function($scope) {

});