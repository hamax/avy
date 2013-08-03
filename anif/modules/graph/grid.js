define(['d3', 'jquery'], function(d3, $) {
	function grid(layout, nodeStyle, linkStyle, nodeSize) {
		this.nodes = {};
		this.history = [];

		this.node = layout.el.append('g').selectAll();

		this.layout = layout;
		this.nodeStyle = nodeStyle;
		this.linkStyle = linkStyle;
		this.nodeSize = nodeSize;
	}

	grid.prototype.set = function(x, y, extra, replace) {
		if (!this.nodes[x]) {
			this.nodes[x] = {};
		}

		// History
		this.history.push(this._setReverse.bind(this, x, y, $.extend(true, {}, this.nodes[x][y])));

		// Create node if it doesn't already exist
		if (!this.nodes[x][y]) {
			this.nodes[x][y] = {extra: {}};
		}

		// Set fields
		this.nodes[x][y].extra = $.extend(true, this.nodes[x][y].extra, extra || {});
	};
	grid.prototype._setReverse = function(x, y, oldNode) {
		// delete if it didn't exist, reset if it did
		if (!oldNode.extra) {
			this.del(x, y);
		} else {
			this.set(x, y, oldNode.extra, true);
		}
	};

	grid.prototype.del = function(x, y) {
		this.history.push(this.set.bind(this, x, y, $.extend(true, {}, this.nodes[x][y].extra)));

		delete this.nodes[x][y];
	};

	grid.prototype.__update__ = function() {
		// Generate node list
		var nodes = [], height = 0;
		for (var x in this.nodes) {
			for (var y in this.nodes[x]) {
				var node = this.nodes[x][y];
				// Calculate real x, y positions
				node.x = x * this.nodeSize[0] + this.nodeSize[0];
				node.y = y * this.nodeSize[1] + this.nodeSize[1];
				nodes.push(node);

				height = Math.max(height, node.y + this.nodeSize[1]);
			}
		}

		// Bind new data
		this.node = this.node.data(nodes, function(d) { return d.x + '-' + d.y; });
		
		// Update nodes
		this.nodeStyle.enter(this.node.enter());
		this.nodeStyle.exit(this.node.exit());
		this.nodeStyle.update(this.node, nodes);
		this.nodeStyle.updatePosition(this.node, nodes);

		// Set layout height
		this.layout.setHeight(height);
	};

	grid.prototype.__reverse__ = function() {
		this.history.pop()();
		this.history.pop();
	};

	return grid;
});