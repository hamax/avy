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
	var v = {
		graph: new graph(svg, new nodeSimple(15, undefined, {anchor: 'start', x: 20, color: 'black'}), new linkSimple())
	};

	playback.load(v);
});