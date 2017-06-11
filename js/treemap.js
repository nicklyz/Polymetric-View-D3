function treemap(data, treeified_data, metrics) {
    // var roots = PMV.treeify(data);
    var treeData = treeified_data.length == 1 ? treeified_data : {"name": "root", "children": treeified_data};
    var root = d3.hierarchy(treeData)
      .sum(function(d) {
          return PMV.getMetric(d, metrics.sort);
      })
      .sort(function(a, b) { return b.height - a.height || b.value - a.value; });
    var color = d3.scale.category20c();

    // delete previous chart
    d3.selectAll("svg").remove();
    var viewerWidth = $(document).width();
    var viewerHeight = $(document).height();

    var svg = d3.select("#body").append("svg")
        .attr("width", viewerWidth)
        .attr("height", viewerHeight);

    var fscale = d3.scale.linear()
        .domain([0, d3.max(data, function (d) { return PMV.getMetric(d, metrics.color); })])
        .range([200,0]);

    var layout = d3.layout.treemap()
    	.size([viewerWidth, viewerHeight])
    	.padding(3)
    	.mode("squarify")
    	.round(true)
    	.sort(function(da, db) {
            return PMV.getMetric(da, metrics.sort) - PMV.getMetric(db, metrics.sort) })
    	// .value(function(d) { return PMV.getMetric(d, metrics.sort); })
    	.children(function(d) { return d.children; });

    var nodes = layout.nodes(root);

    svg.selectAll("rect")
        .data(nodes)
        .enter()
        .append("rect")
    	.attr("x", function(d) { return d.x; })
    	.attr("y", function(d) { return d.y + 1 })
    	.attr("width", function(d) { return d.dx })
    	.attr("height", function(d) { return d.dy })
    	.attr("shape-rendering", "crispEdges")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .style("fill", function(d) { return "hsl(" + fscale(PMV.getMetric(d, metrics.color)) + ", 80%, 50%)" })
        .call(tooltip());
}
