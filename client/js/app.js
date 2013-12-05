var app = angular.module('avy', ['ui.bootstrap', 'ui.codemirror']);

app.config(function($routeProvider, $locationProvider) {
	// Register URL handlers
	$routeProvider
		.when('/', {templateUrl: '/partials/homepage.html', controller: 'HomepageCtrl'})
		.when('/dashboard/', {templateUrl: '/partials/dashboard.html', controller: 'DashboardCtrl'})
		.when('/help/', {templateUrl: '/partials/help.html'})
		.when('/visualizations/', {templateUrl: '/partials/visualizations.html', controller: 'VisualizationsCtrl'})
		.when('/visualizations/:key/', {templateUrl: '/partials/visualization.html', controller: 'VisualizationCtrl'})
		.when('/modules/', {templateUrl: '/partials/modules.html', controller: 'ModulesCtrl'})
		.when('/modules/new', {templateUrl: '/partials/newModule.html', controller: 'NewModuleCtrl'})
		.when('/modules/:devname/:name/', {templateUrl: '/partials/module.html', controller: 'ModuleCtrl'})
		.when('/login', {redirectTo: function() { window.location = '/login'; }})
		.when('/logout', {redirectTo: function() { window.location = '/logout'; }})
		.otherwise({templateUrl: '/partials/404.html'});

	// Use html5 history and #! urls as a fallback
	$locationProvider
		.html5Mode(true)
		.hashPrefix('!');
});

app.controller('RootCtrl', function($scope, $location) {
	// Check if tab is active
	$scope.isActive = function(route) {
		return $location.path().indexOf(route) == 0;
	};

	// Check if user is loged in
	$scope.isAuthenticated = function() {
		return settings.user;
	};
});