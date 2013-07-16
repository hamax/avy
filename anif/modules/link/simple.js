define(['d3'], function(d3) {
	function simple() {
	}

	simple.prototype.enter = function(l) {
		// For each new link append a line
		var line = l.append('line');
		// Set properties
		line.attr('class', 'link');
		// Return reference to newly created lines
		return line;
	};

	simple.prototype.exit = function(l) {
		// Simply remove lines that are not needed anymore
		l.remove();
	};

	simple.prototype.update = function(l, links) {
		l.style('stroke-width', function(d) {
			return d.extra.value || 1;
		});
		l.style('stroke', function(d) {
			if (d.extra.color) {
				return d.extra.color
			}
			if (d.extra.selected) {
				return '#ff0000';
			}
			return '#0000ff';
		});

		// Reset one step styles
		for (var i = 0; i < links.length; i++) {
			if (links[i].extra.selected == 'step') {
				links[i].extra.selected = false;
			}
		}
	};

	return simple;
});