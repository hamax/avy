define(['d3'], function(d3) {
	function simple(radius, text, textOptions) {
		// Node radius, default to 15
		this.radius = radius || 15;
		this.textOptions = textOptions || {};
		
		// What text to display on the node (id, none or custom)
		if (text == undefined) {
			this.textFunc = function(d) {
				return d.id;
			};
		} else if (text == null) {
			this.textFunc = null;
		} else {
			this.textFunc = function(d) {
				return d.extra[text];
			};
		}
	}

	simple.prototype.enter = function(n) {
		var g = n.append('g');
		
		var c = g.append('circle');
		c.attr('class', 'node');
		c.attr('r', this.radius);

		var t = g.append('text');
		t.attr('font-family', 'sans-serif');
		t.attr('fill', this.textOptions.color || 'yellow');
		t.attr('font-size', this.textOptions.size || 20);
		t.attr('text-anchor', this.textOptions.anchor || 'middle');
		t.attr('x', this.textOptions.x || 0);
		t.attr('y', this.textOptions.y || 5);

		return g;
	};

	simple.prototype.exit = function(n) {
		// Simply remove circles that are not needed anymore
		n.remove();
	};

	simple.prototype.update = function(n, nodes) {
		n.select('circle').transition().style('fill', function(d) {
			if (d.extra.color) {
				return d.extra.color
			}
			if (d.extra.selected) {
				return '#ff0000';
			}
			return '#0000ff';
		});

		if (this.textFunc) {
			n.select('text').text(this.textFunc);
		}

		// Reset one step styles
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].extra.selected == 'step') {
				nodes[i].extra.selected = false;
			}
		}
	};

	simple.prototype.updatePosition = function(n, nodes, noTransition) {
		if (!noTransition) {
			n = n.transition();
		}

		n.attr('transform', function(d) {
			return 'translate(' + d.x + ', ' + d.y + ')';
		});
	}

	return simple;
});