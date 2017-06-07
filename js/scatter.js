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

function scatter_plot(example){

    var w = 500,
        h = 500,
        pad = 20,
        left_pad = 100;

    var svg = d3.select("#body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

    var x = d3.scale.linear().domain([0, 23]).range([left_pad, w-pad]),
        y = d3.scale.linear().domain([0, 23]).range([left_pad, h-pad]);


    var xAxis = d3.svg.axis().scale(x).orient("top"),
        yAxis = d3.svg.axis().scale(y).orient("left");


    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0, "+(left_pad-pad)+")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate("+(left_pad-pad)+", 0)")
        .call(yAxis);


    svg.append("text")
        .attr("class", "loading")
        .text("Loading ...")
        .attr("x", function () { return w/2; })
        .attr("y", function () { return h/2-5; });

    var max_h = d3.max(example.map(
                           function (d) { return d.metric.NOA; })),
            hscale = d3.scale.linear()
                .domain([0, d3.max(example, function (d) { return PMV.getMetric(d, "NOA"); })])
                .range([0, 50]);

    var max_w = d3.max(example.map(
                           function (d) { return PMV.getMetric(d, "NOPA"); })),
            wscale = d3.scale.linear()
                .domain([0, d3.max(example, function (d) { return PMV.getMetric(d, "NOPA"); })])
                .range([0, 50]);


    var fscale = d3.scale.linear()
            .domain([0, d3.max(example, function (d) { return PMV.getMetric(d, "CC"); })])
            .range([100,0]);


    svg.selectAll(".loading").remove();

    svg.selectAll("rect")
        .data(example)
        .enter()
        .append("rect")
        .attr("x", function (d) { return x(PMV.getMetric(d, "NOM")); })
        .attr("y", function (d) { return y(PMV.getMetric(d, "WLOC")); })
        .transition()
        .duration(800)
        .attr("width", function (d) { return wscale(PMV.getMetric(d, "NOPA")); })
        .attr("height", function (d) { return hscale(PMV.getMetric(d, "NOA")); })
        //.attr("shape-rendering", "crispEdges")
        .style("fill", function(d) { return "hsl(200, 80%, " + fscale(PMV.getMetric(d, "CC")) + "%)" })


}

scatter_plot(example)
