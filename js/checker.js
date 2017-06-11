function checker(data, metrics) {

	var length = data.length

	var w = (20 + 5) * 100
	var h = (Math.ceil(data.length/20) + 10) * 100

	data.sort(function(da, db) { return PMV.getMetric(db, metrics.sort) - PMV.getMetric(da, metrics.sort); })


	var wmax = d3.max(data, function(d) { return PMV.getMetric(d, metrics.width) });
	var hmax = d3.max(data, function(d) { return PMV.getMetric(d, metrics.height) });


	var wscale = d3.scale.linear()
 	.domain([0, wmax])
    .rangeRound([30, 100]);

  	var hscale = d3.scale.linear()
    .domain([0, hmax])
    .rangeRound([30, 100]);

	var fscale = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return PMV.getMetric(d, metrics.color) })])
    .range([200, 0]);


	newdata = findPosition(data,wscale,metrics)
	//console.log(newdata)


	d3.selectAll("svg").remove();
	//drawcolorbar()

	var chart = d3.select("#body").append("svg")
    .attr("class", "chart")
    .attr("width", w)
    .attr("height", h);

  chart.selectAll("rect")
    .data(newdata)
    .enter().append("rect")
    .attr("x", function(d) { return d.x})
    .attr("y", function(d) { return d.y})
    .attr("width", function(d) { return wscale(PMV.getMetric(d, metrics.width)) })
    .attr("height", function(d) { return hscale(PMV.getMetric(d, metrics.height)) })
		.attr("shape-rendering", "crispEdges")
    //.style("fill", function(d) { return "hsl(200, 80%, " + fscale(PMV.getMetric(d, metrics.color)) + "%)" })
    .style("fill", function(d) { return "hsl(" + fscale(PMV.getMetric(d, metrics.color)) + ", 80%, 50%)" })
	.call(tooltip());
}

function findPosition(data,wscale,metrics){

    var left_pad = 100;
    var pad = 50

	var SPACING = 2
	var max_number = 20
	var curr_number = 0
	var length_sum = left_pad
	var max_height = 100
	var datalength = data.length


	for (i = 0; i < datalength; i++){
		if (curr_number < max_number){
			data[i]["x"] = length_sum
			length_sum += SPACING + wscale(PMV.getMetric(data[i], metrics.width))
			data[i]["y"] = pad + Math.floor(i/max_number)*(max_height + SPACING)
			curr_number ++

		} //still in the same row

		else{
			curr_number = 0
			length_sum = left_pad
			data[i]["x"] = length_sum
			length_sum += SPACING + wscale(PMV.getMetric(data[i], metrics.width))
			data[i]["y"] = pad + (i/max_number)*(max_height + SPACING)
			curr_number ++
		}

	}

	return data
}
