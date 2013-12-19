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
		// Listen for commands
		window.addEventListener('message', function(event) {
			if (event.data.type == 'playback') {
				if (event.data.action == 'toggle' ||
						event.data.action == 'play' && this.play == false ||
						event.data.action == 'pause' && this.play == true) {
					this._playClick();
				}
			}
		}.bind(this), false);
	}

	playback.prototype.load = function(v) {
		this.v = v;

		// Parse arguments from url
		var args = (window.location.hash.substr(1) + '&').split('&'), top = args[1], ref = args[2];
		var args_options = args[0].split(','), filename = args_options[0], options = {};
		for (var i = 1; i < args_options.length; i++) {
			options[args_options[i]] = true;
		}

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

			// Check arguments if it should start paused
			this.play = !options.paused;
			// Step 0 is after initial setup
			this.step = -1;

			// Init buttons and slider
			$('.playback .play').button({
				icons: {
					primary: this.play ? 'ui-icon-pause' : 'ui-icon-play'
				},
				text: false
			}).click(this._playClick.bind(this));
			this.slider = $('.playback .slider').slider({
				value: 0,
				min: 0,
				max: this.steps.length - 1,
				slide: this._sliderChange.bind(this)
			});

			// If there was an exception
			this.broken = false;

			// Call _interval() once to advance to step 0, and if autoplay is enabled, set interval
			this._interval();
			if (this.play && !this.broken) {
				this.interval = setInterval(this._interval.bind(this), 1000);
			}

			// Show controls
			if (!options.nocontrols) {
				$('.controls').css('display', 'block');
				$('.playback').css('display', 'block');
			}

			// Ready to receive commands
			if (window.top != window.self && top) {
				window.top.postMessage({'type': 'ready', 'ref': ref}, top);
			}
		}.bind(this));
	};

	playback.prototype._interval = function(manualSlider, disableUpdate) {
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
			try {
				eval('this.v.' + this.steps[this.step][i] + ';');
			} catch(err) {
				this._handleModuleException(this.steps[this.step][i].split('.')[0], err);
				return;
			}
		}
		
		// Call __update__ method on all top level modules
		if (!disableUpdate) {
			for (var k in this.v) {
				try {
					this.v[k].__update__();
				} catch(err) {
					this._handleModuleException(k, err);
					return;
				}
			}
		}
	};

	playback.prototype._reverse = function(disableUpdate) {
		// Reverse story actions for this step
		for (var i = this.steps[this.step].length - 1; i >= 0; i--) {
			var module = this.steps[this.step][i].split('.')[0];
			try {
				this.v[module].__reverse__();
			} catch(err) {
				this._handleModuleException(module, err);
				return;
			}
		}

		// Call __update__ method on all top level modules
		if (!disableUpdate) {
			for (var k in this.v) {
				try {
					this.v[k].__update__();
				} catch(err) {
					this._handleModuleException(k, err);
					return;
				}
			}
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
		while (target > this.step && !this.broken) {
			this._interval(undefined, true);
		}

		// Reverse
		while (target < this.step && !this.broken) {
			this._reverse(true);
		}

		// Call __update__ method on all top level modules
		for (var k in this.v) {
			try {
				this.v[k].__update__();
			} catch(err) {
				this._handleModuleException(k, err);
				return;
			}
		}
	};

	playback.prototype._handleModuleException = function(module, err) {
		// Set status to broken
		this.broken = true;

		// Stop everything
		if (this.play) {
			clearInterval(this.interval);
		}

		// Hide controls
		$('.controls').css('display', 'none');
		$('.playback').css('display', 'none');

		// Display error
		if (module) {
			alert('Exception in module ' + module + ': ' + err);
		} else {
			alert('Exception: ' + err);
		}
	}

	return new playback();
});