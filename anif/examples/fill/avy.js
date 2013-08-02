define(['m/ziga/core/playback', 'm/ziga/core/svg', 'm/ziga/graph/tree', 'm/ziga/node/simple', 'm/ziga/link/simple'],
		function(playback, svg, graph, nodeSimple, linkSimple) {
	var v = {
		graph: new graph(svg, new nodeSimple(15, undefined, {anchor: 'start', x: 20, color: 'black'}), new linkSimple())
	};

	playback.load(v);
});