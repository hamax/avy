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
		if (event.origin == 'http://anif.' + settings.domain + settings.port && event.data.type == 'fileapi') {
			messages[event.data.id].callback(event.data.content);
		}
	}, false);

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

	$scope.$watch('files', function() {
		if (!$scope.activeFile) {
			for (var i = 0; $scope.files && i < $scope.files.length; i++) {
				if ($scope.files[i].length) {
					$scope.selectFile($scope.files[i][0]);
					break;
				}
			}
		}
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

	$scope.loadReadme = function(file) {
		$scope.readme = 'loading...';
		fileApi.getFile(file.url, function(content) {
			$scope.$apply(function() {
				$scope.readme = content;
			});
		});
	};

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