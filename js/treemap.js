function treemap(data) {
  var source = PMV.fillRoots(data)

  // this cannot have multiple roots
  var root = d3.stratify()
      .id(function(d) { return d.id; })
      .parentId(function(d) { return d.parent; })
      (source);

  var color = d3.scale.category20c();

  // delete previous chart
  d3.selectAll("svg").remove();

  var svg = d3.select("#body").append("svg")
    .attr("width", 1000)
    .attr("height", 1000);

  var fscale = d3.scale.linear()
      .domain([0, d3.max(data, function (d) { return PMV.getMetric(d, "CC"); })])
      .range([100,0]);

  var layout = d3.layout.treemap()
  	.size([699, 699])
  	.padding(3)
  	.mode("squarify")
  	.round(true)
  	.sort(function(da, db) { return PMV.getMetric(da, "NOA") - PMV.getMetric(db, "NOA") })
  	.value(function(d) { return PMV.getMetric(d, "NOA"); })
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
    .style("fill", function(d) { return "hsl(200, 80%, " + fscale(PMV.getMetric(d, "CC")) + "%)" })
    .call(tooltip());

}
