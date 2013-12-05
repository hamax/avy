app.service('fileApi', function() {
	// Iframe for the file API (hosted files must be download on the unsafe domain)
	var iframe = $('<iframe src="http://anif.' + settings.domain + settings.port + '/framework/api.html" style="display: none"></iframe>'),
		ready = false, messages = {}, nextId = 0;
	iframe.load(function() {
		// File API iframe is now ready
		ready = true;
		// Check for queued requests
		for (var id in messages) {
			send(messages[id]);
		}
	});
	$('body').append(iframe);

	// Send message to the file API iframe
	function send(msg) {
		iframe[0].contentWindow.postMessage(msg.content, 'http://anif.' + settings.domain + settings.port);
	}

	// Listen for messages from the file API iframe
	window.addEventListener('message', function(event) {
		if (event.origin == 'http://anif.' + settings.domain + settings.port && event.data.type == 'fileapi') {
			messages[event.data.id].callback(event.data.content);
		}
	}, false);

	// Get a file using the file API
	this.getFile = function(url, callback) {
		var msg = {
			'callback': callback,
			'content': {
				'id': nextId++,
				'url': url
			}
		};
		messages[msg.content.id] = msg;
		if (ready) {
			send(msg);
		}
	};
});

app.controller('CodeEditorCtrl', function($scope, $routeParams, $dialog, api, fileApi) {
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

	// Watch for changes in the file list
	$scope.$watch('files', function() {
		// If active file is not set, select one
		if (!$scope.activeFile) {
			for (var i = 0; $scope.files && i < $scope.files.length; i++) {
				if ($scope.files[i].length) {
					$scope.selectFile($scope.files[i][0]);
					break;
				}
			}
		}
		// If readme is not yet set, check if it's in the file list
		if (!$scope.readme) {
			for (var i = 0; $scope.files && i < $scope.files.length; i++) {
				for (var j = 0; j < $scope.files[i].length; j++) {
					if ($scope.files[i][j].Filename == "README") {
						$scope.loadReadme($scope.files[i][j]);
						break;
					}
				}
				if ($scope.readme) break;
			}
			if ($scope.selected && !$scope.readme && $scope.selected.docs) {
				$scope.selected.code = true;
			}
		}
		// If avyjs is not jey set, check if it's in the file list
		if (!$scope.avyjs) {
			for (var i = 0; $scope.files && i < $scope.files.length; i++) {
				for (var j = 0; j < $scope.files[i].length; j++) {
					if ($scope.files[i][j].Filename == "avy.js") {
						$scope.avyjs = true;
						break;
					}
				}
				if ($scope.avyjs) break;
			}
			if ($scope.selected && !$scope.avyjs && $scope.selected.preview) {
				$scope.selected.code = true;
			}
		}
	});

	// Load readme file
	$scope.loadReadme = function(file) {
		$scope.readme = 'loading...';
		fileApi.getFile(file.url, function(content) {
			$scope.$apply(function() {
				$scope.readme = content;
			});
		});
	};

	// Select a file in the sidebar
	$scope.selectFile = function(file) {
		$scope.activeFile = file.Filename;
		$scope.editor = '';
		$scope.editorMode = ext2mode[file.ext];
		fileApi.getFile(file.url, function(content) {
			$scope.$apply(function() {
				$scope.editor = content;
			});
		});
	};

	// Delete a file
	$scope.deleteFile = function(file) {
		$dialog.messageBox(
			'Confirmation',
			'Are you sure you want to delete ' + file.Filename + '?',
			[{result:'no', label: 'Cancel'}, {result:'yes', label: 'Yes', cssClass: 'btn-primary'}]
		).open().then(function(result) {
			if (result == 'yes') {
				file.delete(function(result) {
					if ($scope.activeFile == file.Filename) {
						$scope.activeFile = null;
						$scope.editor = null;
					}
					$scope.update(result);
				});
			}
		});
	};
});

app.directive('markdown', function() {
	return {
		link: function(scope, elm, attrs, ctrl) {
			attrs.$observe('markdown', function(value) {
				elm.html(markdown.toHTML(value));
			});
		}
	}
});