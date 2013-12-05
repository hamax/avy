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

define(['m/ziga/core/playback', 'm/ziga/core/svg', 'm/ziga/graph/tree', 'm/ziga/node/simple', 'm/ziga/link/simple'],
		function(playback, svg, graph, nodeSimple, linkSimple) {
	var selected = null, history = [];
	var v = {
		graph: new graph(svg, new nodeSimple(15, 'name', {anchor: 'start', x: 20, color: 'black'}), new linkSimple()),
		self: {
			addNode: function(id, name, parent) {
				var sel = false;
				if (!parent) {
					selected = id;
					sel = true;
				}
				v.graph.addNode(id, parent, {name: name, selected: sel});
				history.push(v.graph.__reverse__.bind(v.graph));
			},

			select: function(id) {
				history.push(function(prevSelected) {
					v.graph.__reverse__();
					v.graph.__reverse__();
					selected = prevSelected;
				}.bind(this, selected));

				v.graph.updateNode(selected, {selected: false});
				v.graph.updateNode(id, {selected: true});
				selected = id;
			},

			__update__: function() {

			},

			__reverse__: function() {
				history.pop()();
			}
		}
	};

	playback.load(v);
});