define(['jquery-ui'], function($) {
	function playback() {

	}

	playback.prototype.load = function(v) {
		this.v = v;
		d3.xhr('0.avy', 'text/plain', function(r) {
			var lines = r.response.replace('\r\n', '\n').trim().split('\n'), index = 0;
			this.steps = [[]];
			for (var i = 0; i < lines.length; i++) {
				if (lines[i] == 'step()') {
					this.steps.push([]);
				} else {
					this.steps[this.steps.length - 1].push(lines[i]);
				}
			}
			if (this.steps[this.steps.length - 1].length == 0) {
				this.steps.pop();
			}

			this.play = true;
			this.step = -1;

			$('.playback .play, .playback .pause').button({
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

			this._interval();
			this.interval = setInterval(this._interval.bind(this), 2000);
		}.bind(this));
	};

	playback.prototype._interval = function() {
		this.step++;
		if (this.step >= this.steps.length) {
			this.step = this.steps.length - 1;
			this._playClick();
			return;
		}
		this.slider.slider('value', this.step);

		for (var i = 0; i < this.steps[this.step].length; i++) {
			eval('this.v.' + this.steps[this.step][i] + ';');
		}
		this.v.graph.update();
	};

	playback.prototype._playClick = function(e) {
		if (this.play) {
			clearInterval(this.interval);
			$('.playback .ui-button-icon-primary').toggleClass('ui-icon-pause ui-icon-play');
		} else {
			this.interval = setInterval(this._interval.bind(this), 2000);
			$('.playback .ui-button-icon-primary').toggleClass('ui-icon-play ui-icon-pause');
		}
		this.play = !this.play;
	};

	playback.prototype._sliderChange = function(e, ui) {

	};

	return new playback();
});