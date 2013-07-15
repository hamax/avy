define(['d3'], function(d3) {
	var width = 800, height = 600;

	var el = d3.select("body").append("svg")
		.attr("width", width)
		.attr("height", height);

	return {
		el: el,
		width: width,
		height: height
	}
});