define(['d3', 'jquery'], function(d3, $) {
	function tree(layout, nodeStyle, linkStyle) {
		this.root = {};
		this.nodes = {};
		this.history = [];

		this.tree = d3.layout.tree()
			.size([750, 550]);

		layout.setHeight(600);
		var l = layout.el.append('g').attr('transform', 'translate(25, 25)');
		this.link = l.append('g').selectAll();
		this.node = l.append('g').selectAll();

		this.nodeStyle = nodeStyle;
		this.linkStyle = linkStyle;
	}

	tree.prototype.addNode = function(id, parent, extra) {
		var node = {
			id: JSON.stringify(id),
			parentId: JSON.stringify(parent),
			extra: extra || {},
			children: []
		};

		this.nodes[JSON.stringify(id)] = node;
		if (parent) {
			this.nodes[JSON.stringify(parent)].children.push(node);
		} else {
			this.root = node;
		}

		this.history.push(this.delNode.bind(this, id));
	}

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
	}

	tree.prototype.updateNode = function(id, extra) {
		this.history.push(this.updateNode.bind(this, id, $.extend(true, {}, this.nodes[JSON.stringify(id)].extra)));
		$.extend(true, this.nodes[JSON.stringify(id)].extra, extra);
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
	}

	tree.prototype.__reverse__ = function() {
		this.history.pop()();
		this.history.pop();
	}

	return tree;
});