define(['d3', 'm/ziga/core/svg'], function(d3, svg) {
	var marker = svg.el.append('defs').append('marker')
		.attr('id', 'arrow')
		.attr('viewBox', '0 -5 10 10')
		.attr('refX', 20)
		.attr('refY', -1.5)
		.attr('markerWidth', 6)
		.attr('markerHeight', 6)
		.attr('orient', 'auto')
		.append('path').attr('d', 'M0,-5L10,0L0,5');

	function simple() {
	}

	simple.prototype.enter = function(l) {
		// For each new link append a path
		var p = l.append('path');
		// Set properties
		p.attr('fill', 'none');
		p.attr('marker-end', 'url(#arrow)');
		p.attr('stroke-width', 2.5);
		// Return reference to newly created paths
		return p;
	};

	simple.prototype.exit = function(l) {
		// Simply remove lines that are not needed anymore
		l.remove();
	};

	simple.prototype.update = function(l, links) {
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

	simple.prototype.updatePosition = function(l, links) {
		l.attr('d', function(d) {
			var dx = d.target.x - d.source.x,
				dy = d.target.y - d.source.y,
				dr = Math.sqrt(dx * dx + dy * dy);
			return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
		});
	}

	return simple;
});