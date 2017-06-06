var example = [
  {"id": "1", "parent": "", "name": "Object",
    "metric": {
      "NOA": 1,
      "NOM": 1,
      "WLOC": 3,
    }
  },
  {"id": "2", "parent": "1", "name": "String",
    "metric": {
      "NOA": 3,
      "NOM": 3,
      "WLOC": 5,
    }
  },
  {"id": "3", "parent": "1", "name": "List",
    "metric": {
      "NOA": 5,
      "NOM": 7,
      "WLOC": 8,

    }
  },
  {"id": "4", "parent": "3", "name": "LinkedList",
    "metric": {
      "NOA": 7,
      "NOM": 9,
      "WLOC": 10,
    }
  },
  {"id": "5", "parent": "3", "name": "ArrayList",
    "metric": {
      "NOA": 9,
      "NOM": 13,
      "WLOC": 12,
    }
  },
  {"id": "6", "parent": "", "name": "NULL",
    "metric": {
      "NOA": 12,
      "NOM": 17,
      "WLOC": 19,
    }
  }
];


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

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
    yAxis = d3.svg.axis().scale(y).orient("left");


svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0, "+(h-pad)+")")
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

var max_r = d3.max(example.map(
                       function (d) { return d.metric.NOA; })),
        r = d3.scale.linear()
            .domain([0, d3.max(example, function (d) { return d.metric.NOA; })])
            .range([0, 12]);



svg.selectAll(".loading").remove();

svg.selectAll("circle")
    .data(example)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("cx", function (d) { return x(d.metric.NOM); })
    .attr("cy", function (d) { return y(d.metric.WLOC); })
    .transition()
    .duration(800)
    .attr("r", function (d) { return r(d.metric.NOA); });

























