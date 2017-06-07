class PMV {
  static fillRoots(data) {
    var root = {
      "id": -1,
      "parent": "",
      "name": "root",
      "metric": {}
    }
    data.forEach(function(d) {
      if (d.parent == "") {
        d.parent = -1;
      }
    });
    data.push(root)
    return data;
  }

  static getMetric(d, metric) {
    // data: {
    //   "NOA": int,
    //   "NOM": int,
    //   "WLOC": int,
    //   ...
    // }
    var data;
    console.log(d);
    if(d.hasOwnProperty('data')) {
      data = d.data.metric;
    } else {
      data = d.metric;
    }
    var mi = metric.split("/")
  	if(mi.length == 1) {
  		return data[metric] == undefined ? 0 : data[metric]
  	} else {
  		return (data[mi[1]] != 0) ? (data[mi[0]] / data[mi[1]]) : 0
  	}
  }
}

var tooltip = function(a) {

	// var accessor = arguments.length ? a : undefined;

	function tooltip(selection) {
		selection
			.on("mouseover", function(d) {
				if(d.hasOwnProperty('data')) {
				     d = d.data;
				}
			 	var div = d3.select("body").selectAll("div.tooltip");
				if (div.empty()) {
				 	div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
				}
			  div.html("");
				div.append("h2").text(d.name);
				div.append("p").attr("class", "filename").text(d.name);
				for (var p in d.metric) {
						div.append("p").text(p + ": " + d.metric[p]);
				}
				var ttx = d3.event.pageX;
				var tty = d3.event.pageY - $("div.tooltip").height() - 15;
				var hclip = (ttx + $("div.tooltip").width()) - ($(window).width() + $(window).scrollLeft())
				if (hclip > 0) {
					ttx -= hclip
				}
				div.style("left", Math.max(ttx - 20, $(window).scrollLeft() + 5) + "px")
	  		   .style("top", Math.max(tty, $(window).scrollTop() + 5) + "px");
 				div.transition().duration(100).style("opacity", 0.95);
			})
			.on("mouseout", function(d) {
				div = d3.select("body").select("div.tooltip")
				div.transition().duration(250).style("opacity", 0);
			});
	}

	return tooltip;

};
