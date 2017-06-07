var example = [
  {"id": "1", "parent": "", "name": "Object",
    "metric": {
      "NOA": 1,
      "NOM": 1,
      "WLOC": 3,
      "NOPA": 11,
      "CC": 1,
    }
  },
  {"id": "2", "parent": "1", "name": "String",
    "metric": {
      "NOA": 2,
      "NOM": 3,
      "WLOC": 5,
      "NOPA": 9,
      "CC": 5,
    }
  },
  {"id": "3", "parent": "1", "name": "List",
    "metric": {
      "NOA": 5,
      "NOM": 7,
      "WLOC": 8,
      "NOPA": 3,
      "CC": 10,

    }
  },
  {"id": "4", "parent": "3", "name": "LinkedList",
    "metric": {
      "NOA": 7,
      "NOM": 9,
      "WLOC": 10,
      "NOPA": 4,
      "CC": 15,
    }
  },
  {"id": "5", "parent": "3", "name": "ArrayList",
    "metric": {
      "NOA": 9,
      "NOM": 13,
      "WLOC": 12,
      "NOPA": 4,
      "CC": 20,
    }
  },
  {"id": "6", "parent": "", "name": "NULL",
    "metric": {
      "NOA": 12,
      "NOM": 17,
      "WLOC": 19,
      "NOPA": 4,
      "CC": 25,
    }
  }
];

function treemap(data) {
  var source = PMV.fillRoots(example)

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
  	.value(function(d) { console.log(d); return PMV.getMetric(d, "NOA"); })
  	.children(function(d) { return d.children; });

  var nodes = layout.nodes(root);

  svg.selectAll("rect")
    .data(nodes)
    .enter()
    .append("rect")
  	.attr("x", function(d) { console.log(d); return d.x; })
  	.attr("y", function(d) { return d.y + 1 })
  	.attr("width", function(d) { return d.dx })
  	.attr("height", function(d) { return d.dy })
  	.attr("shape-rendering", "crispEdges")
    .style("fill", function(d) { return "hsl(200, 80%, " + fscale(PMV.getMetric(d, "CC")) + "%)" })
    .call(tooltip());

}

treemap(example);
