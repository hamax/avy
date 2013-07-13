var app = angular.module('avy', ['ui.bootstrap', 'ui.codemirror']);

app.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {templateUrl: '/partials/homepage.html', controller: 'HomepageCtrl'})
		.when('/dashboard', {templateUrl: '/partials/dashboard.html', controller: 'DashboardCtrl'})
		.when('/visualizations/', {templateUrl: '/partials/visualizations.html', controller: 'VisualizationsCtrl'})
		.when('/visualizations/:key/', {templateUrl: '/partials/visualization.html', controller: 'VisualizationCtrl'})
		.when('/modules/', {templateUrl: '/partials/modules.html', controller: 'ModulesCtrl'})
		.when('/modules/new', {templateUrl: '/partials/newModule.html', controller: 'NewModuleCtrl'})
		.when('/modules/:devname/:name', {templateUrl: '/partials/module.html', controller: 'ModuleCtrl'})
		.when('/about', {templateUrl: '/partials/about.html', controller: 'AboutCtrl'})
		.when('/login', {redirectTo: function() { window.location = '/login'; }})
		.when('/logout', {redirectTo: function() { window.location = '/logout'; }})
		.otherwise({redirectTo: '/'});

	$locationProvider
		.html5Mode(true)
		.hashPrefix('!');
});

app.service('api', function($http) {
	$http.defaults.headers.post["Content-Type"] = 'application/x-www-form-urlencoded';

	/*
	 * Visualizations
	 */

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
		$http.get('/api/visualizations/' + key + '/').success(function(result) {
			callback(result);
		});
	}

	this.setVisualizationTitle = function(key, title) {
		$http.post('/api/visualizations/' + key + '/title', $.param({'title': title}));
	}

	/*
	 * Modules
	 */

	this.listModules = function(callback) {
		$http.get('/api/modules/').success(function(result) {
			for (var i = 0; i < result.length; i++) {
				result[i].Date = Date.parse(result[i].Date);
			}
			callback(result);
		});
	}

	this.newModule = function(module, callback) {
		$http.post('/api/modules/', $.param(module)).success(function(result) {
			callback(result);
		});
	}

	this.getModule = function(devname, name, callback) {
		$http.get('/api/modules/' + devname + '/' + name + '/').success(function(result) {
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
		$location.path('/visualizations/' + key + '/');
	};

	$scope.createNew = function() {
		api.newVisualization(function(key) {
			$location.path('/visualizations/' + key + '/');
		});
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

app.controller('ModulesCtrl', function($scope, $location, api) {
	api.listModules(function(result) {
		$scope.modules = result;
	});

	$scope.click = function(module) {
		$location.path('/modules/' + module.Devname + '/' + module.Name + '/');
	};

	$scope.createNew = function() {
		$location.path('/modules/new');
	};
});

app.controller('NewModuleCtrl', function($scope, $location, api) {
	$scope.create = function() {
		api.newModule($scope.module, function(response) {
			$location.path('/modules/' + response.Devname + '/' + response.Name + '/');
		});
	};
});


app.controller('ModuleCtrl', function($scope, $routeParams, api, fileApi) {
	$scope.devname = $routeParams.devname;
	$scope.name = $routeParams.name
	api.getModule($scope.devname, $scope.name, function(result) {
		$scope.update(result);
	});

	/*
	 * Code tab
	 */

	$scope.update = function(data) {
		$scope.data = data;

		$scope.files = [data.Files || []];
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

app.controller('CodeEditorCtrl', function($scope, $routeParams, api, fileApi) {
	$scope.editorOptions = {
		lineNumbers: true,
		lineWrapping: true,
		tabSize: 4,
		indentUnit: 4,
		indentWithTabs: true,
		readOnly: 'nocursor'
	};

	var ext2mode = {
		'js': 'text/javascript',
		'c': 'text/x-csrc',
		'cpp': 'text/x-c++src',
		'java': 'text/x-java',
		'py': 'text/x-python',
		'avy': 'text/javascript'
	};

	$scope.$watch('files', function() {
		if (!$scope.activeFile) {
			for (var i = 0; $scope.files && i < $scope.files.length; i++) {
				if ($scope.files[i].length) {
					$scope.selectFile($scope.files[i][0]);
					return;
				}
			}
		}
	});

	$scope.selectFile = function(file) {
		$scope.activeFile = file.Filename;
		$scope.editor = '';
		$scope.editorMode = ext2mode[file.ext];
		fileApi.getVisualizationFile($scope.key, file.Filename, function(content) {
			$scope.$apply(function() {
				$scope.editor = content;
			});
		});
	};
});

app.controller('AboutCtrl', function($scope) {

});