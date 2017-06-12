function tree(data, treeified_data, metrics) {
    // build hierachy data
    // var roots = PMV.treeify(data);
    var treeData = treeified_data.length == 1 ? treeified_data : {"name": "root", "children": treeified_data};
    var wmax = d3.max(data, function(d) { return PMV.getMetric(d, metrics.width) });
    var hmax = d3.max(data, function(d) { return PMV.getMetric(d, metrics.height) });
    var wscale = d3.scale.linear()
        .domain([0, wmax])
        .rangeRound([5, 50]);

    var hscale = d3.scale.linear()
        .domain([0, hmax])
        .rangeRound([5, 50]);

    var fscale = d3.scale.linear()
        .domain([0, d3.max(data, function (d) { return PMV.getMetric(d, metrics.color); })])
        .range([100,0]);

    // Calculate total nodes, max label length
    var totalNodes = 0;
    var maxLabelLength = 0;

    // Misc. variables
    var i = 0;
    var duration = 750;
    var root;

    // size of the diagram
    var viewerWidth = $(document).width();
    var viewerHeight = $(document).height();

    // delete the previous chart
    d3.selectAll("g").remove();
    d3.selectAll("svg").remove();

    var tree = d3.layout.tree()
        .size([viewerHeight, viewerWidth]);

    // define a d3 diagonal projection for use by the node paths later on.
    var diagonal = d3.svg.diagonal()
        .projection(function(d) {
            return [d.y, d.x];
        });

    // A recursive helper function for performing some setup by walking through all nodes

    function visit(parent, visitFn, childrenFn) {
        if (!parent) return;

        visitFn(parent);

        var children = childrenFn(parent);
        if (children) {
            var count = children.length;
            for (var i = 0; i < count; i++) {
                visit(children[i], visitFn, childrenFn);
            }
        }
    }

    // Call visit function to establish maxLabelLength
    visit(treeData, function(d) {
        totalNodes++;
        maxLabelLength = Math.max(d.name.length, maxLabelLength);
    }, function(d) {
        return d.children && d.children.length > 0 ? d.children : null;
    });

    // Define the zoom function for the zoomable tree

    function zoom() {
        svgGroup.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
    }

    // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

    // define the baseSvg, attaching a class for styling and the zoomListener
    var baseSvg = d3.select("#body").append("svg")
        .attr("width", viewerWidth)
        .attr("height", viewerHeight)
        .attr("class", "overlay")
        .call(zoomListener);

    // Helper functions for collapsing and expanding nodes.

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    function expand(d) {
        if (d._children) {
            d.children = d._children;
            d.children.forEach(expand);
            d._children = null;
        }
    }

    // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.

    function centerNode(source) {
        scale = zoomListener.scale();
        x = -source.y0;
        y = -source.x0;
        x = x * scale + viewerWidth / 2;
        y = y * scale + viewerHeight / 2;
        d3.select('g').transition()
            .duration(duration)
            .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
        zoomListener.scale(scale);
        zoomListener.translate([x, y]);
    }

    // Toggle children function

    function toggleChildren(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
        }
        return d;
    }

    // Toggle children on click.

    function click(d) {
        if (d3.event.defaultPrevented) return; // click suppressed
        d = toggleChildren(d);
        update(d);
        // centerNode(d);
    }

    function update(source) {
        // Compute the new height, function counts total children of root node and sets tree height accordingly.
        // This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
        // This makes the layout more consistent.
        var levelWidth = [1];
        var childCount = function(level, n) {

            if (n.children && n.children.length > 0) {
                if (levelWidth.length <= level + 1) levelWidth.push(0);

                levelWidth[level + 1] += n.children.length;
                n.children.forEach(function(d) {
                    childCount(level + 1, d);
                });
            }
        };
        childCount(0, root);
        var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line
        // console.log(newHeight);
        tree = tree.size([newHeight, viewerWidth]);
        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        // Set widths between levels based on maxLabelLength.
        nodes.forEach(function(d) {
            d.y = (d.depth * (maxLabelLength * 5)); //maxLabelLength * 10px
            // alternatively to keep a fixed scale one can set a fixed depth per level
            // Normalize for fixed-depth by commenting out below line
            // d.y = (d.depth * 500); //500px per level.
        });

        // Update the nodes…
        node = svgGroup.selectAll("g.node")
            .data(nodes, function(d) {
                return d.id || (d.id = ++i);
            });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            // .call(dragListener)
            .attr("class", "tree node")
            .attr("transform", function(d) {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            })
            .on('click', click);

        nodeEnter.append("rect")
            .attr('class', 'nodeRect')
            .attr("width", function (d) {
                return wscale(PMV.getMetric(d, metrics.width));
            })
            .attr("height", function (d) {
                return hscale(PMV.getMetric(d, metrics.height));
            });
            // .style("fill", function(d) {
            //     return d._children ? "lightsteelblue" : "#fff";
            // });

        // Change the circle  depending on whether it has children and is collapsed
        node.select("rect.nodeRect")
            .attr("stroke", function(d) {
                return d._children ? "red" : "steelblue";
            })
            .attr("stroke-width", 0.5)
            // .style("fill", function(d) { return "hsl(200, 80%, " + fscale(PMV.getMetric(d, metrics.color)) + "%)" })
            .style("fill", function(d) { return "hsl(" + fscale(PMV.getMetric(d, metrics.color)) + ", 80%, 50%)" })
            .call(tooltip());

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")";
            });

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        nodeExit.select("rect")
          .attr("width", function (d) {
            return wscale(PMV.getMetric(d, metrics.width));
          })
          .attr("height", function (d) {
            return hscale(PMV.getMetric(d, metrics.height));
          })
        //   .attr("stroke", "black")
        //   .attr("stroke-width", 1);

        // Update the links…
        var link = svgGroup.selectAll("path.link")
            .data(links, function(d) {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "tree link")
            .attr("d", function(d) {
                var o = {
                    x: source.x0,
                    y: source.y0
                };
                return diagonal({
                    source: o,
                    target: o
                });
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {
                    x: source.x,
                    y: source.y
                };
                return diagonal({
                    source: o,
                    target: o
                });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
        // delete root node and root links
        link.each(function(d){
              if (d.source.name == "root") {
                d3.select(this).remove();
              }
        });
        nodeEnter.each(function(d){
          if (d.name == "root") {
            d3.select(this).remove();
          }
        });
        nodeUpdate.each(function(d){
          if (d.name == "root") {
            d3.select(this).remove();
          }
        });
        nodeExit.each(function(d){
          if (d.name == "root") {
            d3.select(this).remove();
          }
        });
        svgGroup.selectAll("circle").call(tooltip());
    }

    // Append a group which holds all nodes and which the zoom Listener can act upon.
    var svgGroup = baseSvg.append("g");

    // Define the root
    root = treeData;
    root.x0 = viewerHeight / 2;
    root.y0 = 0;

	// collapse all children of roots children before rendering.
	root.children.forEach(function(child){
		collapse(child);
	});

    // Layout the tree initially and center on the root node.
    update(root);
    // centerNode(root);
}
