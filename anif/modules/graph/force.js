/* ========================================================================
 * Avy Algorithm Visualization Framework
 * https://github.com/hamax/avy
 * ========================================================================
 * Copyright 2013 Ziga Ham
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */

define(['d3', 'jquery'], function(d3, $) {
	function force(layout, nodeStyle, linkStyle) {
		this.nodes = [];
		this.links = [];
		this.history = [];

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
			return "Node already exists.";
		}
		// Add to the node list, won't be created until update call
		this.nodes.push({id: JSON.stringify(id), extra: extra || {}});
		this.history.push([this.delNode.bind(this, id)]);
	};

	force.prototype.delNode = function(id) {
		var idJson = JSON.stringify(id);
		var h = [];

		var index = this._nodeIndex(idJson);
		if (index == -1) {
			return "Node doesn't exist."
		}

		// Delete broken links
		for (var i = 0; i < this.links.length; i++) {
			if (this.links[i].source.id == idJson || this.links[i].target.id == idJson) {
				h.push(this.addLink.bind(this, JSON.parse(this.links[i].source.id), JSON.parse(this.links[i].target.id), $.extend(true, {}, this.links[i].extra)));
				this.links.splice(i, 1);
				i--;
			}
		}

		h.push(this.addNode.bind(this, id, $.extend(true, {}, this.nodes[index].extra)));
		this.history.push(h);

		// Delete from the node list
		this.nodes.splice(index, 1);
	};

	force.prototype.updateNode = function(id, extra, replace) {
		var index = this._nodeIndex(JSON.stringify(id));
		if (index == -1) {
			return "Node doesn't exist."
		}

		this.history.push([this.updateNode.bind(this, id, $.extend(true, {}, this.nodes[index].extra), true)]);
		if (replace) {
			this.nodes[index].extra = extra;
		} else {
			$.extend(true, this.nodes[index].extra, extra);
		}
	};

	force.prototype.addLink = function(source, target, extra) {
		var h = [];

		// Add nodes if they are missing
		var sourceIndex = this._nodeIndex(JSON.stringify(source));
		if (sourceIndex == -1) {
			sourceIndex = this.nodes.length;
			var r = this.addNode(source);
			if (r) {
				return r;
			}
			h = h.concat(this.history.pop());
		}
		var targetIndex = this._nodeIndex(JSON.stringify(target));
		if (targetIndex == -1) {
			targetIndex = this.nodes.length;
			var r = this.addNode(target);
			if (r) {
				return r;
			}
			h = h.concat(this.history.pop());
		}

		// Check if it already exists
		var index = this._linkIndex(JSON.stringify(source), JSON.stringify(target));
		if (index == -1) {
			this.links.push({
				source: this.nodes[sourceIndex],
				target: this.nodes[targetIndex],
				extra: extra || {}
			});
			h.push(this.delLink.bind(this, source, target));
		}

		this.history.push(h);
	};

	force.prototype.delLink = function(source, target) {
		var index = this._linkIndex(JSON.stringify(source), JSON.stringify(target));
		if (index == -1) {
			return "Link doesn't exist.";
		}

		this.history.push([this.addLink.bind(this, source, target, $.extend(true, {}, this.links[index].extra))]);
		this.links.splice(index, 1);
	};

	force.prototype.updateLink = function(source, target, extra, replace) {
		var index = this._linkIndex(JSON.stringify(source), JSON.stringify(target));
		if (index == -1) {
			return "Link doesn't exist."
		}

		this.history.push([this.updateLink.bind(this, source, target, $.extend(true, {}, this.links[index].extra, true))]);
		if (replace) {
			this.links[index].extra = extra;
		} else {
			$.extend(true, this.links[index].extra, extra);
		}
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

	force.prototype.__reverse__ = function() {
		var h = this.history.pop();
		for (var i = h.length - 1; i >= 0; i--) {
			var r = h[i]();
			if (r) {
				return r;
			}
			this.history.pop();
		}
	};

	// Get index in the nodes array by id
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

	// Get index in the links array by source and target id
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

	// Tick in the physics of the d3 force layout (nodes can change positions)
	force.prototype._forceTick = function() {
		// Update position, make sure it's without transitions
		this.linkStyle.updatePosition(this.link, this.links, true);
		this.nodeStyle.updatePosition(this.node, this.nodes, true);
	};

	return force;
});