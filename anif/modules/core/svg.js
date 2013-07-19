define(['d3', 'jquery'], function(d3, $) {
	// Base SVG class
	function svg() {
		this.el = d3.select('body').append('svg');
		this.el.attr('width', '100%');
		$(window).resize(this._resize.bind(this));
		this.layout = new layout(this.el, $(window).width(), this);
	}

	svg.prototype._resize = function() {
		this.layout._updateWidth($(window).width());
	};

	svg.prototype._updateHeight = function() {
		this.el.attr('height', this.layout.height);
		if (window.top != window.self && window.location.hash) {
			window.top.postMessage({'type': 'resize', 'height': $(document).height()}, window.location.hash.substr(1));
		}
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