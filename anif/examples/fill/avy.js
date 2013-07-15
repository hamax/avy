define(['m/ziga/core/playback', 'm/ziga/core/svg', 'm/ziga/graph/force', 'm/ziga/node/simple', 'm/ziga/link/simple'],
		function(playback, svg, graph, nodeSimple, linkSimple) {
	var v = {};
	v.graph = new graph(svg, new nodeSimple(), new linkSimple());

	playback.load(v);
});