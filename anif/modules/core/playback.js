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

define(['jquery-ui'], function($) {
	function playback() {

	}

	playback.prototype.load = function(v) {
		this.v = v;
		var filename = window.location.hash.substr(1).split('&')[0];
		d3.xhr(filename, 'text/plain', function(r) {
			// Parse avy file into this.steps
			var lines = r.response.replace('\r\n', '\n').trim().split('\n'), index = 0;
			this.steps = [[]];
			for (var i = 0; i < lines.length; i++) {
				if (lines[i] == 'step()') {
					this.steps.push([]);
				} else {
					this.steps[this.steps.length - 1].push(lines[i]);
				}
			}
			while (this.steps.length && this.steps[this.steps.length - 1].length == 0) {
				this.steps.pop();
			}

			// We start with autoplay and step -1 (step 0 is after initial setup)
			this.play = true;
			this.step = -1;

			// Init buttons and slider
			$('.playback .play').button({
				icons: {
					primary: 'ui-icon-pause'
				},
				text: false
			}).click(this._playClick.bind(this));
			this.slider = $('.playback .slider').slider({
				value: 0,
				min: 0,
				max: this.steps.length - 1,
				slide: this._sliderChange.bind(this)
			});

			// Call _interval() once to advance to step 0, and if autoplay is enabled, set interval
			this._interval();
			if (this.play) {
				this.interval = setInterval(this._interval.bind(this), 1000);
			}

			// Show controls
			$('.controls').css('display', 'block');
			$('.playback').css('display', 'block');
		}.bind(this));
	};

	playback.prototype._interval = function(manualSlider) {
		// Move for one step
		this.step++;
		if (this.step >= this.steps.length) {
			this.step = this.steps.length - 1;
			this._playClick();
			return;
		}
		// Don't move slider if this is a result of a manual slider move
		if (!manualSlider) {
			this.slider.slider('value', this.step);
		}

		// Execute story actions
		for (var i = 0; i < this.steps[this.step].length; i++) {
			var r = eval('this.v.' + this.steps[this.step][i] + ';');
			if (r) {
				alert(r);
			}
		}
		
		// Call __update__ method on all top level modules
		for (var k in this.v) {
			this.v[k].__update__();
		}
	};

	playback.prototype._reverse = function() {
		// Reverse story actions for this step
		for (var i = this.steps[this.step].length - 1; i >= 0; i--) {
			var module = this.steps[this.step][i].split('.')[0];
			var r = this.v[module].__reverse__();
			if (r) {
				alert(r);
			}
		}

		// Call __update__ method on all top level modules
		for (var k in this.v) {
			this.v[k].__update__();
		}

		// Move to previous step
		this.step--;
	};

	playback.prototype._playClick = function(e) {
		// Play/pause button
		if (this.play) {
			clearInterval(this.interval);
			$('.playback .ui-button-icon-primary').toggleClass('ui-icon-pause ui-icon-play');
		} else {
			this.interval = setInterval(this._interval.bind(this), 1000);
			$('.playback .ui-button-icon-primary').toggleClass('ui-icon-play ui-icon-pause');
		}
		this.play = !this.play;
	};

	playback.prototype._sliderChange = function(e, ui) {
		// Slider was manually changed, get target step and stop interval
		var target = ui.value;
		if (this.play) {
			this._playClick();
		}

		// Fast forward
		while (target > this.step) {
			this._interval();
		}

		// Reverse
		while (target < this.step) {
			this._reverse();
		}
	};

	return new playback();
});