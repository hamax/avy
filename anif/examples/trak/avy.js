define(['m/ziga/core/playback', 'm/ziga/core/svg', 'm/ziga/graph/force', 'm/ziga/node/simple', 'm/ziga/link/arrow', 'm/ziga/list/list'],
		function(playback, svg, graph, nodeSimple, linkArrow, list) {
	var nodeStyle = new nodeSimple(), linkStyle = new linkArrow();

	var v = {};
	v.graph = new graph(svg.add(), nodeStyle, linkStyle);
	v.list = new list(svg.add(), nodeStyle);

	playback.load(v);
});