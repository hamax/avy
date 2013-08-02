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