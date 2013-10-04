define(['d3', 'jquery'], function(d3, $) {
	function tree(layout, nodeStyle, linkStyle, nodeSize) {
		this.root = {};
		this.nodes = {};
		this.history = [];

		this.tree = d3.layout.tree()
			.nodeSize(nodeSize || [150, 150]);

		this.panel = layout.el.append('g');
		this.link = this.panel.append('g').selectAll();
		this.node = this.panel.append('g').selectAll();

		this.layout = layout;
		this.nodeStyle = nodeStyle;
		this.linkStyle = linkStyle;

		this.layout.onWidthChange(this._onWidthChange.bind(this));
		this._onWidthChange();
	}

	tree.prototype.addNode = function(id, parent, extra) {
		var node = {
			id: JSON.stringify(id),
			parentId: JSON.stringify(parent),
			extra: extra || {},
			children: []
		};

		this.nodes[JSON.stringify(id)] = node;
		if (parent != null) {
			this.nodes[JSON.stringify(parent)].children.push(node);
		} else {
			this.root = node;
		}

		this.history.push(this.delNode.bind(this, id));
	};

	tree.prototype.delNode = function(id) {
		// Find node and it's parent
		var node = this.nodes[JSON.stringify(id)];
		var parent = this.nodes[node.parentId];

		// Push to history
		this.history.push(this.addNode.bind(this, id, JSON.parse(node.parentId), $.extend(true, {}, node.extra)));
		
		// Delete node
		if (node == this.root) {
			this.root = {};
		}
		parent.children.splice(parent.children.indexOf(node), 1);
		delete this.nodes[JSON.stringify(id)];
	};

	tree.prototype.updateNode = function(id, extra) {
		this.history.push(this.updateNode.bind(this, id, $.extend(true, {}, this.nodes[JSON.stringify(id)].extra)));
		$.extend(true, this.nodes[JSON.stringify(id)].extra, extra);
	};

	tree.prototype.reparentNode = function(id, newParentId) {
		// Find node and it's parent
		var node = this.nodes[JSON.stringify(id)];
		var parent = this.nodes[node.parentId];
		var newParent = this.nodes[JSON.stringify(newParentId)];

		// Push to history
		this.history.push(this.reparentNode.bind(this, id, node.parentId));

		// Reparent node
		parent.children.splice(parent.children.indexOf(node), 1);
		newParent.children.push(node);
		node.parentId = JSON.stringify(newParentId);
	}

	tree.prototype.__update__ = function() {
		var nodes = this.tree.nodes($.extend(true, {}, this.root));
		var links = this.tree.links(nodes);
		for (var i = 0; i < links.length; i++) {
			links[i].extra = {};
		}

		this.node = this.node.data(nodes, function(d) { return d.id; });
		this.link = this.link.data(links, function(d) { return d.source.id + '-' + d.target.id; });

		// Update links
		this.linkStyle.enter(this.link.enter());
		this.linkStyle.exit(this.link.exit());
		this.linkStyle.update(this.link, links);
		this.linkStyle.updatePosition(this.link, links);
		
		// Update nodes
		this.nodeStyle.enter(this.node.enter());
		this.nodeStyle.exit(this.node.exit());
		this.nodeStyle.update(this.node, nodes);
		this.nodeStyle.updatePosition(this.node, nodes);

		// Set graph height
		var maxY = 0;
		for (var i = 0; i < nodes.length; i++) {
			if (nodes[i].y > maxY) {
				maxY = nodes[i].y;
			}
		}
		this.layout.setHeight(maxY + 4 * this.nodeStyle.radius);
	};

	tree.prototype.__reverse__ = function() {
		this.history.pop()();
		this.history.pop();
	};

	tree.prototype._onWidthChange = function() {
		// Center graph
		this.panel.attr('transform', 'translate(' + (this.layout.width / 2) + ', ' + (2 * this.nodeStyle.radius) + ')');
	};

	return tree;
});