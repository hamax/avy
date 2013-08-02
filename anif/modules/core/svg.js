define(['d3', 'jquery-ui'], function(d3, $) {
	// Base SVG class
	function svg() {
		this.el = d3.select('svg');
		$(window).resize(this._resize.bind(this));
		this.layout = new layout(this.el, $(window).width(), this);

		// Controls
		$('.controls .save').button({
			icons: {
				primary: 'ui-icon-disk'
			},
			text: false
		}).click(this._saveClick.bind(this));

		// Show controls
		$('.controls').css('display', 'block');
		$('.controls .save').css('display', 'block');
	}

	svg.prototype._resize = function() {
		this.layout._updateWidth($(window).width());
	};

	svg.prototype._updateHeight = function() {
		this.el.attr('height', this.layout.height);

		var top = (window.location.hash.substr(1) + '&').split('&')[1];
		if (window.top != window.self && top) {
			window.top.postMessage({'type': 'resize', 'height': $('body').height()}, top);
		}
	};

	svg.prototype._saveClick = function() {
		// Get svg
		this.el.attr('width', $('svg').width());
		var svg = $('.svg').html();
		this.el.attr('width', '100%');
		// Base64 encode it and generate data url
		var b64url = 'data:image/svg+xml;base64,' + btoa(svg);
		// Save it
		$('<a href="' + b64url + '" download="visualization.svg"></a>')[0].click();
	};

	// Layout class
	function layout(el, width, parent) {
		this.el = el;
		this.parent = parent;
		this.children = [];
		this.width = width;
		this.height = 0;
		this.onWidthChangeListeners = [];
	}

	layout.prototype.add = function() {
		var g = new layout(this.el.append('g'), this.width, this);
		this.children.push(g);
		return g;
	};

	layout.prototype.setHeight = function(height) {
		this.height = height;
		this.parent._updateHeight();
	};

	layout.prototype.onWidthChange = function(callback) {
		this.onWidthChangeListeners.push(callback);
	};

	layout.prototype._updateHeight = function() {
		this.height = 0;
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].el.attr('transform', 'translate(0, ' + this.height + ')');
			this.height += this.children[i].height;
		}
		this.parent._updateHeight();
	};

	layout.prototype._updateWidth = function(width) {
		this.width = width;
		for (var i = 0; i < this.children.length; i++) {
			this.children[i]._updateWidth(width);
		}
		for (var i = 0; i < this.onWidthChangeListeners.length; i++) {
			this.onWidthChangeListeners[i]();
		}
	};

	return new svg().layout;
});