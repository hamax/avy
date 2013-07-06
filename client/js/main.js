var app = angular.module('avy', ['ui.bootstrap']);

app.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {templateUrl: 'partials/homepage.html', controller: 'HomepageCtrl'})
		.when('/dashboard', {templateUrl: 'partials/dashboard.html', controller: 'DashboardCtrl'})
		.when('/visualizations', {templateUrl: 'partials/visualizations.html', controller: 'VisualizationsCtrl'})
		.when('/modules', {templateUrl: 'partials/modules.html', controller: 'ModulesCtrl'})
		.when('/about', {templateUrl: 'partials/about.html', controller: 'AboutCtrl'})
		.when('/login', {redirectTo: function() { window.location = '/login'; }})
		.when('/logout', {redirectTo: function() { window.location = '/logout'; }})
		.otherwise({redirectTo: '/'});

	$locationProvider
		.html5Mode(true)
		.hashPrefix('!');
});

app.controller('RootCtrl', function($scope, $location) {
	$scope.isActive = function(route) {
		return route === $location.path();
	};
});

app.controller('HomepageCtrl', function($scope) {

});

app.controller('DashboardCtrl', function($scope) {
	$scope.uploadComplete = function() {
		
	};

	$scope.uploadError = function() {
		alert('error');
	};
});

app.controller('VisualizationsCtrl', function($scope) {

});

app.controller('ModulesCtrl', function($scope) {

});

app.controller('AboutCtrl', function($scope) {

});