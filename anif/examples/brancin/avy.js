define(['m/ziga/core/playback', 'm/ziga/core/svg', 'm/ziga/graph/grid', 'm/ziga/node/simple', 'm/ziga/link/simple'],
		function(playback, svg, grid, nodeSimple, linkSimple) {
	var v = {
		grid: new grid(svg, new nodeSimple(15, 'value'), new linkSimple(), [30, 30])
	};

	playback.load(v);
});