define(['d3'], function(d3) {
	function tree(svg) {
		this.nodes = [];
		this.links = [];

		this.force = d3.layout.tree()
			.size([svg.width, svg.height]);

		this.node = svg.el.selectAll('.node');
		this.link = svg.el.selectAll('.link');
	}

	tree.prototype.addNode = function(id, extra) {
		this.nodes.push({id: JSON.stringify(id), extra: extra || {}});
	}

	tree.prototype.delNode = function(id) {
		var index = this._nodeIndex(id);
		if (index != -1) {
			this.nodes.splice(index, 1);
		}
	}

	tree.prototype.addLink = function(source, target, extra) {
		var sourceIndex = this._nodeIndex(JSON.stringify(source)),
			targetIndex = this._nodeIndex(JSON.stringify(target));

		if (sourceIndex == -1) {
			sourceIndex = this.nodes.length;
			this.addNode(source);
		}
		if (targetIndex == -1) {
			targetIndex = this.nodes.length;
			this.addNode(target);
		}

		this.links.push({
			source: this.nodes[sourceIndex],
			target: this.nodes[targetIndex],
			extra: extra || {}
		});
	}

	tree.prototype.delLink = function(source, target) {

	}

	tree.prototype.update = function() {
		this.force.start();

		this.node = this.node.data(this.nodes, function(d) { return d.id; });
		this.link = this.link.data(this.links, function(d) { return d.source.id + '-' + d.target.id; });

		this.node.enter()
			.append('circle')
			.attr('class', 'node')
			.attr('r', 20)
			.style('fill', function(d) { return d.extra.color; })
			.call(this.force.drag);

		this.node.exit()
			.remove();

		this.link.enter()
			.append('line')
			.attr('class', 'link')
			.style('stroke-width', function(d) { return d.extra.value || 1; });

		this.link.exit()
			.remove();
	}

	tree.prototype._nodeIndex = function(id) {
		var index = -1;
		for (var i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i].id == id) {
				index = i;
				break;
			}
		}
		return index;
	}

	tree.prototype._forceTick = function() {
		this.node
			.attr('cx', function(d) { return d.x; })
			.attr('cy', function(d) { return d.y; });

		this.link
			.attr('x1', function(d) { return d.source.x; })
			.attr('y1', function(d) { return d.source.y; })
			.attr('x2', function(d) { return d.target.x; })
			.attr('y2', function(d) { return d.target.y; });
	}

	return tree;
});