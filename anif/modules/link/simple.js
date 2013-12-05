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

define(['d3', 'm/ziga/core/svg'], function(d3, svg) {
	function simple() {
	}

	simple.prototype.enter = function(l) {
		// For each new link append a line
		var line = l.append('line');
		// Set properties
		line.attr('class', 'link');
		// Return reference to newly created lines
		return line;
	};

	simple.prototype.exit = function(l) {
		// Simply remove lines that are not needed anymore
		l.remove();
	};

	simple.prototype.update = function(l, links) {
		l.style('stroke-width', function(d) {
			return d.extra.value || 1;
		});
		l.style('stroke', function(d) {
			if (d.extra.color) {
				return d.extra.color
			}
			if (d.extra.selected) {
				return '#ff0000';
			}
			return '#0000ff';
		});

		// Reset one step styles
		for (var i = 0; i < links.length; i++) {
			if (links[i].extra.selected == 'step') {
				links[i].extra.selected = false;
			}
		}
	};

	simple.prototype.updatePosition = function(l, links, noTransition) {
		if (!noTransition) {
			l = l.transition();
		}

		l.attr('x1', function(d) { return d.source.x; });
		l.attr('y1', function(d) { return d.source.y; });
		l.attr('x2', function(d) { return d.target.x; });
		l.attr('y2', function(d) { return d.target.y; });
	}

	return simple;
});