define(['d3'], function(d3) {
	function simple(radius) {
		this.radius = radius || 15;
	}

	simple.prototype.enter = function(n) {
		// For each new node append a circle
		var c = n.append('circle');
		// Set class, radius and fill
		c.attr('class', 'node');
		c.attr('r', this.radius);
		c.style('fill', function(d) { return d.extra.color || 'transparent'; });
		// Return a reference to the newly created circles
		return c;
	};

	simple.prototype.exit = function(n) {
		// Simply remove circles that are not needed anymore
		n.remove();
	};

	return simple;
});