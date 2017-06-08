function scatter(data){

    var w = 500,
        h = 500,
        pad = 20,
        left_pad = 100;

    d3.selectAll("svg").remove();

    var svg = d3.select("#body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

    var x = d3.scale.linear().domain([0, d3.max(data, function (d) { return PMV.getMetric(d, "NOM"); })]).range([left_pad, w-pad]),
        y = d3.scale.linear().domain([0, d3.max(data, function (d) { return PMV.getMetric(d, "WLOC"); })]).range([left_pad, h-pad]);


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

    var max_h = d3.max(data.map(
                           function (d) { return d.metric.NOA; })),
            hscale = d3.scale.linear()
                .domain([0, d3.max(data, function (d) { return PMV.getMetric(d, "NOA"); })])
                .range([0, 50]);

    var max_w = d3.max(data.map(
                           function (d) { return PMV.getMetric(d, "NOPA"); })),
            wscale = d3.scale.linear()
                .domain([0, d3.max(data, function (d) { return PMV.getMetric(d, "NOPA"); })])
                .range([0, 50]);


    var fscale = d3.scale.linear()
            .domain([0, d3.max(data, function (d) { return PMV.getMetric(d, "CC"); })])
            .range([100,0]);


    svg.selectAll(".loading").remove();

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function (d) { return x(PMV.getMetric(d, "NOM")); })
        .attr("y", function (d) { return y(PMV.getMetric(d, "WLOC")); })
        .transition()
        .duration(800)
        .attr("width", function (d) { return wscale(PMV.getMetric(d, "NOPA")); })
        .attr("height", function (d) { return hscale(PMV.getMetric(d, "NOA")); })
        //.attr("shape-rendering", "crispEdges")
        .style("fill", function(d) { return "hsl(200, 80%, " + fscale(PMV.getMetric(d, "CC")) + "%)" });
}
