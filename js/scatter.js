function scatter(data, metrics){

    var w = 1000,
        h = 1000,
        pad = 20,
        left_pad = 100;

    d3.selectAll("svg").remove();

    var svg = d3.select("#body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

    var x = d3.scale.linear().domain([0, d3.max(data, function (d) { return PMV.getMetric(d, metrics.x); })]).range([left_pad, w-pad]),
        y = d3.scale.linear().domain([0, d3.max(data, function (d) { return PMV.getMetric(d, metrics.y); })]).range([left_pad, h-pad]);


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
                           function (d) { return PMV.getMetric(d, metrics.height); })),
            hscale = d3.scale.linear()
                .domain([0, d3.max(data, function (d) { return PMV.getMetric(d, metrics.height); })])
                .range([5, 50]);

    var max_w = d3.max(data.map(
                           function (d) { return PMV.getMetric(d, metrics.width); })),
            wscale = d3.scale.linear()
                .domain([0, d3.max(data, function (d) { return PMV.getMetric(d, metrics.width); })])
                .range([5, 50]);


    var fscale = d3.scale.linear()
            .domain([0, d3.max(data, function (d) { return PMV.getMetric(d, metrics.color); })])
            .range([200,0]);


    svg.selectAll(".loading").remove();

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function (d) { return x(PMV.getMetric(d, metrics.x)); })
        .attr("y", function (d) { return y(PMV.getMetric(d, metrics.y)); })

        .attr("width", function (d) { return wscale(PMV.getMetric(d, metrics.width)); })
        .attr("height", function (d) { return hscale(PMV.getMetric(d, metrics.height)); })
        .attr("shape-rendering", "crispEdges")
        //.style("fill", function(d) { return "hsl(200, 80%, " + fscale(PMV.getMetric(d, metrics.color)) + "%)" })
        .style("fill", function(d) { return "hsl(" + fscale(PMV.getMetric(d, metrics.color)) + ", 80%, 50%)" })
        .call(tooltip())











}
