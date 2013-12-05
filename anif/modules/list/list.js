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
	function list(layout, nodeStyle) {
		this.layout = layout;
		this.nodeStyle = nodeStyle;

		this.nodes = [];
		this.node = layout.el.selectAll();
		this.history = [];

		this.layout.onWidthChange(this.__update__.bind(this));
	}

	list.prototype.add = function(id, extra) {
		this.nodes.push({id: JSON.stringify(id), extra: extra || {}});
		this.history.push(this.pop.bind(this));
	};

	list.prototype.del = function(id) {
		// Delete from the node list
		var index = this._nodeIndex(JSON.stringify(id));
		if (index != -1) {
			this.nodes.splice(index, 1);
			// TODO: history
		}
	};

	list.prototype.pop = function() {
		if (!this.nodes.length) {
			throw "List is empty."
		}

		var index = this.nodes.length - 1;
		this.history.push(this.add.bind(this, this.nodes[index].id, $.extend(true, {}, this.nodes[index].extra)));
		this.nodes.pop();
	};

	list.prototype.update = function(id, extra, replace) {
		var index = this._nodeIndex(JSON.stringify(id));
		if (index == -1) {
			throw "Element doesn't exist."
		}

		this.history.push(this.update.bind(this, id, $.extend(true, {}, this.nodes[index].extra, true)));
		if (replace) {
			this.nodes[index].extra = extra;
		} else {
			$.extend(true, this.nodes[index].extra, extra);
		}
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

	list.prototype.__reverse__ = function() {
		var r = this.history.pop()();
		this.history.pop();
		return r;
	};

	// Get index in the nodes array by id
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