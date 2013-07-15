define(['d3'], function(d3) {
	function force(svg, nodeStyle, linkStyle) {
		this.nodes = [];
		this.links = [];

		this.force = d3.layout.force()
			.charge(-200)
			.size([svg.width, svg.height])
			.nodes(this.nodes)
			.links(this.links)
			.linkDistance(200)
			.on('tick', this._forceTick.bind(this));

		this.node = svg.el.selectAll('.node');
		this.link = svg.el.selectAll('.link');

		this.nodeStyle = nodeStyle;
		this.linkStyle = linkStyle;
	}

	force.prototype.addNode = function(id, extra) {
		// Add to the node list, won't be created until update call
		this.nodes.push({id: JSON.stringify(id), extra: extra || {}});
	}

	force.prototype.delNode = function(id) {
		// Delete from the node list
		var index = this._nodeIndex(id);
		if (index != -1) {
			this.nodes.splice(index, 1);
		}
	}

	force.prototype.addLink = function(source, target, extra) {
		var sourceIndex = this._nodeIndex(JSON.stringify(source)),
			targetIndex = this._nodeIndex(JSON.stringify(target));

		// Add nodes if they are missing
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

	force.prototype.delLink = function(source, target) {
		// TODO: implement
	}

	force.prototype.update = function() {
		// Restart force layout
		this.force.start();

		// Bind data
		this.node = this.node.data(this.nodes, function(d) { return d.id; });
		this.link = this.link.data(this.links, function(d) { return d.source.id + '-' + d.target.id; });

		// Update nodes
		this.nodeStyle.enter(this.node.enter()).call(this.force.drag);
		this.nodeStyle.exit(this.node.exit());

		// Update links
		this.linkStyle.enter(this.link.enter());
		this.linkStyle.exit(this.link.exit());
	}

	force.prototype._nodeIndex = function(id) {
		var index = -1;
		for (var i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i].id == id) {
				index = i;
				break;
			}
		}
		return index;
	}

	force.prototype._forceTick = function() {
		this.node
			.attr('cx', function(d) { return d.x; })
			.attr('cy', function(d) { return d.y; });

		this.link
			.attr('x1', function(d) { return d.source.x; })
			.attr('y1', function(d) { return d.source.y; })
			.attr('x2', function(d) { return d.target.x; })
			.attr('y2', function(d) { return d.target.y; });
	}

	return force;
});