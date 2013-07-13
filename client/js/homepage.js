app.controller('HomepageCtrl', function($scope) {
	$scope.slides = [];
	for (var i = 0; i < 5; i++) {
		$scope.slides.push({
			image: 'http://placekitten.com/' + (500 + Math.round(Math.random() * 300)) + '/300',
		});
	}
});