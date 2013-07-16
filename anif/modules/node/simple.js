define(['d3'], function(d3) {
	function simple(radius) {
		this.radius = radius || 15;
	}

	simple.prototype.enter = function(n) {
		// For each new node append a circle
		var c = n.append('circle');
		// Set atrributes
		c.attr('class', 'node');
		c.attr('r', this.radius);
		// Return a reference to the newly created circles
		return c;
	};

	simple.prototype.exit = function(n) {
		// Simply remove circles that are not needed anymore
		n.remove();
	};

	simple.prototype.update = function(n, nodes) {
		n.style('fill', function(d) {
			if (d.extra.color) {
				return d.extra.color
			}
			if (d.extra.selected) {
				return '#ff0000';
			}
			return '#0000ff';
		});

		// Reset one step styles
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].extra.selected == 'step') {
				nodes[i].extra.selected = false;
			}
		}
	};

	return simple;
});