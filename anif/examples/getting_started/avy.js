// Load required modules (core, list, node)
define(['m/ziga/core/playback', 'm/ziga/core/svg', 'm/ziga/list/list', 'm/ziga/node/simple'],
		function(playback, svg, list, node) {
	// Define modules that will be handling calls from dot avy files
	// In this case we need a list that will handle list.add
	// We could also implement that function directly in this file
	var v = {
		// List needs a svg layer (pass the main one or create a sublayer with svg.add())
		// and a node style (handles drawing of the nodes in the list)
		list: new list(svg, new node())
	};

	// Start playback of our dot avy files
	playback.load(v);
});