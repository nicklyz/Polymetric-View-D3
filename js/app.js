class PMV {
  static fillRoots(data) {
    var root = {
      "id": "root",
      "parent": "",
      "name": "root",
      "metrics": {}
    }
    data.forEach(function(d) {
      if (d.parent == "") {
        d.parent = "root";
      }
    });
    data.push(root)
    return data;
  }
  static treeify(list, idAttr, parentAttr, childrenAttr) {
    if (!idAttr) idAttr = 'id';
    if (!parentAttr) parentAttr = 'parent';
    if (!childrenAttr) childrenAttr = 'children';

    var treeList = [];
    var lookup = {};
    list.forEach(function(obj) {
        lookup[obj[idAttr]] = obj;
        obj[childrenAttr] = [];
    });
    list.forEach(function(obj) {
        if (obj[parentAttr] != "" && obj[parentAttr] in lookup) {
            lookup[obj[parentAttr]][childrenAttr].push(obj);
        } else {
            treeList.push(obj);
        }
    });
    return treeList;
  };
  static getMetric(d, metric) {
    var data;
    if(d.hasOwnProperty('data')) {
      data = d.data.metrics;
    } else {
      data = d.metrics;
    }
  	return data == undefined || data[metric] == undefined ? 0 : data[metric];
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
				for (var p in d.metrics) {
					div.append("p").text(p + ": " + d.metrics[p]);
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
