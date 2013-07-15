define(['d3'], function(d3) {
	function simple() {
	}

	simple.prototype.enter = function(l) {
		// For each new link append a line
		var line = l.append('line');
		// Set properties
		line.attr('class', 'link');
		line.style('stroke-width', function(d) { return d.extra.value || 1; });
		// Return reference to newly created lines
		return line;
	};

	simple.prototype.exit = function(l) {
		// Simply remove lines that are not needed anymore
		l.remove();
	};

	return simple;
});