define(['d3', 'jquery'], function(d3, $) {
	function list(layout, nodeStyle) {
		this.layout = layout;
		this.nodeStyle = nodeStyle;

		this.nodes = [];
		this.node = layout.el.selectAll();

		this.layout.onWidthChange(this.__update__.bind(this));
	}

	list.prototype.add = function(id, extra) {
		this.nodes.push({id: JSON.stringify(id), extra: extra || {}});
	};

	list.prototype.del = function(id) {
		// Delete from the node list
		var index = this._nodeIndex(JSON.stringify(id));
		if (index != -1) {
			this.nodes.splice(index, 1);
		}
	};

	list.prototype.update = function(id, extra) {
		var index = this._nodeIndex(JSON.stringify(id));
		$.extend(true, this.nodes[index].extra, extra);
	};

	list.prototype.__update__ = function() {
		// Calculate node x, y
		var x = -this.nodeStyle.radius, y = this.nodeStyle.radius * 2;
		for (var i = 0; i < this.nodes.length; i++) {
			x += this.nodeStyle.radius * 3;
			if (x + this.nodeStyle.radius * 2 > this.layout.width) {
				x = this.nodeStyle.radius * 2;
				y += this.nodeStyle.radius * 3;
			}

			this.nodes[i].x = x;
			this.nodes[i].y = y;
		}
		this.layout.setHeight(y + this.nodeStyle.radius * 2);

		// Bind data
		this.node = this.node.data(this.nodes, function(d) { return d.id; });

		// Update nodes
		this.nodeStyle.enter(this.node.enter());
		this.nodeStyle.exit(this.node.exit());
		this.nodeStyle.update(this.node, this.nodes);
		this.nodeStyle.updatePosition(this.node, this.nodes);
	};

	list.prototype._nodeIndex = function(id) {
		var index = -1;
		for (var i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i].id == id) {
				index = i;
				break;
			}
		}
		return index;
	};

	return list;
});