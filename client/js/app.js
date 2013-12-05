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