function tree(data, metrics) {
    // var source = PMV.fillRoots(data);
    var roots = PMV.treeify(data);

    var root = roots.length == 1 ? roots : {"name": "root", "children": roots};
    height = 800;
    // this cannot have multiple roots
    // var root = d3.stratify()
    //     .id(function(d) { return d.id; })
    //     .parentId(function(d) { return d.parent; })
    //     (source);

    var wmax = d3.max(data, function(d) { return PMV.getMetric(d, metrics.width) });
    var hmax = d3.max(data, function(d) { return PMV.getMetric(d, metrics.height) });

    var wscale = d3.scale.linear()
    	  .domain([0, wmax])
          .rangeRound([5, 50]);

    var hscale = d3.scale.linear()
        .domain([0, hmax])
        .rangeRound([5, 50]);

    // var tree = d3.layout.tree().nodeSize([70, 40]);
    // var diagonal = d3.svg.diagonal()
    //   .projection(function (d) {
    //     return [d.x, d.y];
    // });
    // delete the previous chart
    d3.selectAll("svg").remove();

    // var svg = d3.select("body").append("svg").attr("width", 1000).attr("height", 1000)
    //   .call(zm = d3.behavior.zoom().scaleExtent([1,3]).on("zoom", redraw)).append("g")
    //   .attr("transform", "translate(" + 350 + "," + 20 + ")");
    //
    // //necessary so that zoom knows where to zoom and unzoom from
    // zm.translate([350, 20]);
    //
    // root.x0 = 0;
    // root.y0 = height / 2;
    // size of the diagram
    var viewerWidth = $(document).width();
    var viewerHeight = $(document).height();

    var margin = {top: 40, right: 120, bottom: 20, left: 120},
	   width = 960 - margin.right - margin.left,
       height = 500 - margin.top - margin.bottom;
    var i = 0;

    var tree = d3.layout.tree()
    	.size([height, width]);

    var diagonal = d3.svg.diagonal()
    	.projection(function(d) { return [d.x, d.y]; });

    var svg = d3.select("#body").append("svg")
    	.attr("width", viewerWidth)
    	.attr("height", viewerHeight)
        .append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    update(root);

    function update(source) {

      // Compute the new tree layout.
      var nodes = tree.nodes(root).reverse(),
    	  links = tree.links(nodes);

      // Normalize for fixed-depth.
      nodes.forEach(function(d) { d.y = d.depth * 100; });

      // Declare the nodes…
      var node = svg.selectAll("g.node")
    	  .data(nodes, function(d) { return d.id || (d.id = ++i); });

      // Enter the nodes.
      var nodeEnter = node.enter().append("g")
    	  .attr("class", "node")
    	  .attr("transform", function(d) {
    		  return "translate(" + d.x + "," + d.y + ")"; });

      nodeEnter.append("circle")
    	  .attr("r", 10)
    	  .style("fill", "#fff");

      nodeEnter.append("text")
    	  .attr("y", function(d) {
    		  return d.children || d._children ? -18 : 18; })
    	  .attr("dy", ".35em")
    	  .attr("text-anchor", "middle")
    	  .text(function(d) { return d.name; })
    	  .style("fill-opacity", 1);

      // Declare the links…
      var link = svg.selectAll("path.link")
    	  .data(links, function(d) { return d.target.id; });

      // Enter the links.
      link.enter().insert("path", "g")
    	  .attr("class", "link")
    	  .attr("d", diagonal);

    }
}
