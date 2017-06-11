function treeflower(data, treeified_data, metrics) {
    var treeData = treeified_data.length == 1 ? treeified_data : {"name": "root", "children": treeified_data};
    var rmax = d3.max(data, function(d) { return PMV.getMetric(d, metrics.width) });
    var rscale = d3.scale.linear()
                .domain([0, rmax])
                .rangeRound([5, 25]);
    var fscale = d3.scale.linear()
                .domain([0, d3.max(data, function (d) { return PMV.getMetric(d, metrics.color); })])
                .range([200,0]);

    // var viewerWidth = $(document).width();
    // var viewerHeight = $(document).height();
    var viewerWidth = 1000;
    var viewerHeight = 700;

    d3.selectAll("svg").remove();

    var svg = d3.select("#body").append("svg")
        .attr('width', viewerWidth)
        .attr('height', viewerHeight);
    var root;

    var force = d3.layout.force()
        .size([viewerWidth, viewerHeight])
        .on("tick", tick)
        .linkDistance(function(d) { return d.target._children ? 80 : 40; });

    var link = svg.selectAll(".link"),
        node = svg.selectAll(".node");


    function update() {
        var nodes = flatten(root),
            links = d3.layout.tree().links(nodes);

        // Restart the force layout.
        force
          .nodes(nodes)
          .links(links)
          .start();

        // Update the links…
        link = link.data(links, function(d) { return d.target.id; });

        // Exit any old links.
        link.exit().remove();

        // Enter any new links.
        link.enter().insert("line", ".node")
            .attr("class", "treeflower link")
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        // Update the nodes…
        node = node.data(nodes, function(d) { return d.id; });

        // Exit any old nodes.
        node.exit().remove();

        // Enter any new nodes.
        node.enter().append("circle")
            .attr("class", "treeflower node")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            // .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 4.5; })
            .attr("r", function(d) {
                return rscale(PMV.getMetric(d, metrics.width));
            })
            .on("click", click)
            .call(force.drag)
            .call(tooltip());
        svg.selectAll("circle")
            .attr("stroke", function(d) {
                return d.children ? "#c6dbef" : d._children ? "red" : "#c6dbef";
            })
            .style("fill", function(d) { return "hsl(" + fscale(PMV.getMetric(d, metrics.color)) + ", 80%, 50%)" })

    }

    function tick() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }

    // Toggle children on click.
    function click(d) {
        // if (!d3.event.defaultPrevented) {
            if (d.children) {
              d._children = d.children;
              d.children = null;
            } else {
              d.children = d._children;
              d._children = null;
            }
            update();
        // }
    }

    // Returns a list of all nodes under the root.
    function flatten(root) {
      var nodes = [], i = 0;

      function recurse(node) {
        if (node.children) node.children.forEach(recurse);
        if (!node.id) node.id = ++i;
        nodes.push(node);
      }

      recurse(root);
      return nodes;
    }

    function collapse(d) {
        if (d.children && d.children.length == 0) {
            d.children = null;
        }
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }
    root = treeData;
    collapse(root);
    update();
}
