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