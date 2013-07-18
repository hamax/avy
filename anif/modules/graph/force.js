define(['d3', 'jquery'], function(d3, $) {
	function force(layout, nodeStyle, linkStyle) {
		this.nodes = [];
		this.links = [];

		this.force = d3.layout.force()
			.charge(-200)
			.size([800, 600])
			.nodes(this.nodes)
			.links(this.links)
			.linkDistance(200)
			.on('tick', this._forceTick.bind(this));

		layout.setHeight(600);
		this.link = layout.el.append('g').selectAll();
		this.node = layout.el.append('g').selectAll();

		this.nodeStyle = nodeStyle;
		this.linkStyle = linkStyle;
	}

	force.prototype.addNode = function(id, extra) {
		// Check if it already exists
		var index = this._nodeIndex(JSON.stringify(id));
		if (index != -1) {
			return;
		}
		// Add to the node list, won't be created until update call
		this.nodes.push({id: JSON.stringify(id), extra: extra || {}});
	};

	force.prototype.delNode = function(id) {
		id = JSON.stringify(id);

		// Delete broken links
		for (var i = 0; i < this.links.length; i++) {
			if (this.links[i].source.id == id || this.links[i].target.id == id) {
				this.links.splice(i, 1);
				i--;
			}
		}
		// Delete from the node list
		var index = this._nodeIndex(id);
		if (index != -1) {
			this.nodes.splice(index, 1);
		}
	};

	force.prototype.updateNode = function(id, extra) {
		var index = this._nodeIndex(JSON.stringify(id));
		$.extend(true, this.nodes[index].extra, extra);
	};

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

		// Check if it already exists
		var index = this._linkIndex(JSON.stringify(source), JSON.stringify(target));
		if (index != -1) {
			return;
		}

		this.links.push({
			source: this.nodes[sourceIndex],
			target: this.nodes[targetIndex],
			extra: extra || {}
		});
	};

	force.prototype.delLink = function(source, target) {
		var index = this._linkIndex(JSON.stringify(source), JSON.stringify(target));
		if (index != -1) {
			this.links.splice(index, 1);
		}
	};

	force.prototype.updateLink = function(source, target, extra) {
		var index = this._linkIndex(JSON.stringify(source), JSON.stringify(target));
		$.extend(true, this.links[index].extra, extra);
	};

	force.prototype.__update__ = function() {
		// Restart force layout
		this.force.start();

		// Bind data
		this.node = this.node.data(this.nodes, function(d) { return d.id; });
		this.link = this.link.data(this.links, function(d) { return d.source.id + '-' + d.target.id; });

		// Update links
		this.linkStyle.enter(this.link.enter());
		this.linkStyle.exit(this.link.exit());
		this.linkStyle.update(this.link, this.links);

		// Update nodes
		this.nodeStyle.enter(this.node.enter()).call(this.force.drag);
		this.nodeStyle.exit(this.node.exit());
		this.nodeStyle.update(this.node, this.nodes);
	};

	force.prototype._nodeIndex = function(id) {
		var index = -1;
		for (var i = 0; i < this.nodes.length; i++) {
			if (this.nodes[i].id == id) {
				index = i;
				break;
			}
		}
		return index;
	};

	force.prototype._linkIndex = function(source, target) {
		var index = -1;
		for (var i = 0; i < this.links.length; i++) {
			if (this.links[i].source.id == source && this.links[i].target.id == target) {
				index = i;
				break;
			}
		}
		return index;
	}

	force.prototype._forceTick = function() {
		this.linkStyle.updatePosition(this.link, this.links);
		this.nodeStyle.updatePosition(this.node, this.nodes);
	};

	return force;
});