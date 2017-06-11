function drawcolorbar(){

    var w = 80
    var h = 200

    //d3.selectAll("svg").remove();
    var svg = d3.select("#colorbar")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

    var defs = svg.append("defs");

//Append a linearGradient element to the defs and give it a unique id
    var linearGradient = defs.append("linearGradient")
    .attr("id", "linear-gradient");

    //Horizontal gradient
    linearGradient
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%");


    linearGradient.selectAll("stop") 
    .data([ 
        {offset: "0%", color: "hsl(200, 80%, 50%)"}, 
        {offset: "12.5%", color: "hsl(175, 80%, 50%)"},
        {offset: "25%", color: "hsl(150, 80%, 50%)"}, 
        {offset: "37.5%", color: "hsl(125, 80%, 50%)"},
        {offset: "50%", color: "hsl(100, 80%, 50%)"}, 
        {offset: "62.5%", color: "hsl(75, 80%, 50%)"},
        {offset: "75%", color: "hsl(50, 80%, 50%)"}, 
        {offset: "87.5%", color: "hsl(25, 80%, 50%)"}, 
        {offset: "100%", color: "hsl(0, 80%, 50%)"}
      ])  

    .enter().append("stop")
    .attr("offset", function(d) { return d.offset; })   
    .attr("stop-color", function(d) { return d.color; });
 

    svg.append("rect")
    .attr("width", 20)
    .attr("height", 120)
    .attr("x",1)
    .style("fill", "url(#linear-gradient)");

    svg.append("text")
    .attr("x", 25)
    .attr("y", 15)
    .text("0")
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("fill", "blue");


    svg.append("text")
    .attr("x", 25)
    .attr("y", 120)
    .text("200")
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("fill", "red");
}



function scatter(data, metrics){

    var w = 1000,
        h = 1000,
        pad = 20,
        left_pad = 100;

    d3.selectAll("svg").remove();

    //drawcolorbar()

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

