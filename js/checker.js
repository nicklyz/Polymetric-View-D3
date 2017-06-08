function checker(data, metrics) {

  
	var wmax = d3.max(data, function(d) { return PMV.getMetric(d, metrics.width) });
	var hmax = d3.max(data, function(d) { return PMV.getv(d, at.height) });
	

  
	var wscale = d3.scale.linear()
    .domain([0, wmax])
    .rangeRound([4, 40]);

  var hscale = d3.scale.linear()
    .domain([0, hmax])
    .rangeRound([4, 40]);
  
	var fscale = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return PMV.getv(d, at.shade) })])
    .range([100, 0]);

	var layout = quadratic()
		.width(function(d) { return wscale(PMV.getv(d, at.width)) })
		.height(function(d) { return hscale(PMV.getv(d, at.height)) });
		 
	var items = layout(data);
	
	d3.selectAll("svg").remove();
	var chart = d3.select("#chart-wrapper").append("svg")
    .attr("class", "chart")
    .attr("width", layout.xmax())
    .attr("height", layout.ymax());

  chart.selectAll("rect")
    .data(items)
    .enter().append("rect")
    .attr("x", function(d) { return d.x })
    .attr("y", function(d) { return d.y })
    .attr("width", function(d) { return wscale(PMV.getv(d.item, at.width)) })
    .attr("height", function(d) { return hscale(PMV.getv(d.item, at.height)) })
		.attr("shape-rendering", "crispEdges")
    .style("fill", function(d) { return "hsl(200, 80%, " + fscale(PMV.getv(d.item, at.shade)) + "%)" });
}



